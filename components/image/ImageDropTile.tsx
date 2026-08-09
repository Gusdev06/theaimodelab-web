'use client';

import { useRef, useState, type DragEvent } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2, Pencil, Plus, X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageCropModal } from '@/components/image/ImageCropModal';
import { GALLERY_IMAGE_DRAG_TYPE } from '@/components/gallery/GalleryCard';

const DEFAULT_MAX_MB = 5;

export interface UploadedImage {
  /** base64 cru (sem prefixo dataURL) — formato esperado pela API */
  base64: string;
  mime_type: string;
  /** dataURL para exibir o preview */
  preview: string;
}

interface ImageDropTileProps {
  label: string;
  value: UploadedImage | null;
  onChange: (image: UploadedImage | null) => void;
  /** ícone do estado vazio (default: +) */
  icon?: LucideIcon;
  /** mime types aceitos (default: jpeg/png/webp) */
  accept?: string[];
  /** tamanho máximo em MB (default: 5) */
  maxMB?: number;
  className?: string;
}

/** Tile de upload de uma imagem: clique ou arraste; preview com remover. */
export function ImageDropTile({
  label,
  value,
  onChange,
  icon: Icon = Plus,
  accept = ['image/jpeg', 'image/png', 'image/webp'],
  maxMB = DEFAULT_MAX_MB,
  className,
}: ImageDropTileProps) {
  const t = useTranslations('home');
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!accept.includes(file.type)) {
      toast.error(t('clone.invalidFormat'));
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      toast.error(t('clone.tooLarge', { max: maxMB }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onChange({ base64: dataUrl.split(',')[1], mime_type: file.type, preview: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  // Carrega uma imagem arrastada da galeria (URL) — usa o proxy p/ contornar CORS
  // antes de converter para base64, mesmo caminho das referências.
  const handleUrl = async (url: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const mime = blob.type || 'image/jpeg';
      if (!accept.includes(mime)) {
        toast.error(t('clone.invalidFormat'));
        return;
      }
      if (blob.size > maxMB * 1024 * 1024) {
        toast.error(t('clone.tooLarge', { max: maxMB }));
        return;
      }
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      onChange({ base64: dataUrl.split(',')[1], mime_type: mime, preview: dataUrl });
    } catch {
      toast.error(t('clone.invalidFormat'));
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  // Aceita tanto arquivos (upload) quanto imagens arrastadas da galeria.
  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const url = e.dataTransfer.getData(GALLERY_IMAGE_DRAG_TYPE);
    if (url) {
      void handleUrl(url);
      return;
    }
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(',')}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            'group relative h-full min-h-[96px] overflow-hidden rounded-xl border bg-app-surface',
            dragOver ? 'border-[rgba(225,29,42,0.6)]' : 'border-app-hairline',
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value.preview} alt={label} className="size-full object-cover" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(13,16,17,0.6)] backdrop-blur-sm">
              <Loader2 className="size-5 animate-spin text-app-text" strokeWidth={2} />
            </div>
          )}
          <span className="absolute bottom-1.5 left-1.5 rounded-full bg-[rgba(13,16,17,0.7)] px-2 py-0.5 text-[10.5px] font-semibold text-app-text backdrop-blur-sm">
            {label}
          </span>
          <div className="absolute right-1.5 top-1.5 flex items-center gap-1 opacity-0 transition-opacity duration-200 ease-app group-hover:opacity-100">
            <button
              type="button"
              aria-label={t('image.cropEdit')}
              title={t('image.cropEdit')}
              onClick={() => setCropOpen(true)}
              className="flex size-5 items-center justify-center rounded-full bg-[rgba(13,16,17,0.75)] text-app-text-2 backdrop-blur-sm transition-colors duration-200 ease-app hover:text-app-lime"
            >
              <Pencil className="size-3" strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label={t('clone.remove')}
              onClick={() => onChange(null)}
              className="flex size-5 items-center justify-center rounded-full bg-[rgba(13,16,17,0.75)] text-app-text-2 backdrop-blur-sm transition-colors duration-200 ease-app hover:text-app-text"
            >
              <X className="size-3" strokeWidth={2} />
            </button>
          </div>
          {cropOpen && (
            <ImageCropModal
              src={value.preview}
              mimeType={value.mime_type}
              onClose={() => setCropOpen(false)}
              onCrop={(result) => onChange(result)}
            />
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            'app-press flex h-full min-h-[96px] w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed text-app-text-2 transition-colors duration-200 ease-app',
            dragOver
              ? 'border-[rgba(225,29,42,0.6)] bg-[rgba(225,29,42,0.05)] text-app-text'
              : 'border-app-hairline-2 hover:border-[rgba(225,29,42,0.4)] hover:text-app-text',
          )}
        >
          {loading ? (
            <Loader2 className="size-[19px] animate-spin" strokeWidth={1.8} />
          ) : (
            <Icon className="size-[19px]" strokeWidth={1.8} />
          )}
          <span className="px-2 text-center text-[12px] font-semibold">{label}</span>
        </button>
      )}
    </div>
  );
}

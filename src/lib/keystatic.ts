import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

// Reader читает контент Keystatic напрямую из файловой системы (папка content/)
// во время сборки/SSR. process.cwd() — корень проекта.
export const reader = createReader(process.cwd(), keystaticConfig);

export type Service = Awaited<ReturnType<typeof reader.collections.services.all>>[number];
export type Advantage = Awaited<ReturnType<typeof reader.collections.advantages.all>>[number];
export type Review = Awaited<ReturnType<typeof reader.collections.reviews.all>>[number];
export type Faq = Awaited<ReturnType<typeof reader.collections.faq.all>>[number];
export type Promotion = Awaited<ReturnType<typeof reader.collections.promotions.all>>[number];
export type ServicePage = Awaited<ReturnType<typeof reader.collections.servicePages.all>>[number];

/**
 * Источник картинки для страниц услуг: приоритет у загруженного файла, иначе внешний URL.
 */
export function imgSrc(img?: { upload?: string | null; url?: string | null } | null): string {
  if (!img) return '';
  return img.upload || img.url || '';
}

/** Сортировка записей коллекции по полю order. */
export function byOrder<T extends { entry: { order: number } }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.entry.order - b.entry.order);
}

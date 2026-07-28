import { NewsCategory, Prisma } from '@prisma/client';
import slugify from 'slugify';
import { ApiError } from '../../common/ApiError';
import { prisma } from '../../config/prisma';
import { CreateNewsInput, ListNewsQuery, UpdateNewsInput } from './news.schema';

function buildBaseSlug(title: string): string {
  const slug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  return slug || `news-${Date.now()}`;
}

async function buildUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const baseSlug = buildBaseSlug(title);
  let candidate = baseSlug;
  let suffix = 1;

  // Pastikan slug unik tanpa ketergantungan pada input manual dari client.
  while (true) {
    const existing = await prisma.news.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}

export async function listPublicNews(filter: ListNewsQuery) {
  const page = filter.page ?? 1;
  const limit = filter.limit ?? 10;

  const where = {
    isPublished: true,
    ...(filter.category ? { category: filter.category } : {}),
  } satisfies Prisma.NewsWhereInput;

  const [items, totalItems] = await prisma.$transaction([
    prisma.news.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.news.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
}

export async function getPublicNewsBySlug(slug: string) {
  const item = await prisma.news.findFirst({
    where: { slug, isPublished: true },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!item) {
    throw ApiError.notFound('Berita tidak ditemukan');
  }

  return item;
}

export async function getNewsById(id: string) {
  const item = await prisma.news.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!item) {
    throw ApiError.notFound('Berita tidak ditemukan');
  }

  return item;
}

// --- Admin (FR-ADM-06) ---

export async function listAllNewsForAdmin(filter: { category?: NewsCategory }) {
  return prisma.news.findMany({
    where: {
      ...(filter.category ? { category: filter.category } : {}),
    },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function createNews(input: CreateNewsInput, authorId?: string) {
  const slug = await buildUniqueSlug(input.title);

  try {
    return await prisma.news.create({
      data: {
        ...input,
        slug,
        authorId,
        publishedAt: input.publishedAt ?? new Date(),
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw ApiError.conflict('Judul berita menghasilkan slug yang sudah dipakai');
    }
    throw error;
  }
}

export async function updateNews(id: string, input: UpdateNewsInput) {
  const current = await getNewsById(id);

  const nextSlug = input.title ? await buildUniqueSlug(input.title, id) : current.slug;
  const nextPublishedAt =
    input.publishedAt ?? (input.isPublished && !current.isPublished ? new Date() : undefined);

  try {
    return await prisma.news.update({
      where: { id },
      data: {
        ...input,
        slug: nextSlug,
        ...(nextPublishedAt ? { publishedAt: nextPublishedAt } : {}),
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw ApiError.conflict('Judul berita menghasilkan slug yang sudah dipakai');
    }
    throw error;
  }
}

export async function deleteNews(id: string) {
  await getNewsById(id);
  await prisma.news.delete({ where: { id } });
}

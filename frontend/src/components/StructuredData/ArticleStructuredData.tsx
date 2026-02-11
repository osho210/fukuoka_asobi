import { PlayPlan } from '@/__generated__/graphql';
import { removeUndefinedValues } from '@/lib/structuredDataUtils';

interface ArticleStructuredDataProps {
  plan: PlayPlan;
}

export default function ArticleStructuredData({ plan }: ArticleStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: plan.planName,
    description: plan.catchCopy || plan.leadText || plan.description || undefined,
    image: plan.imageUrl || plan.imageUrls?.[0]?.url || undefined,
    datePublished: plan.createdAt || undefined,
    dateModified: plan.updatedAt || plan.createdAt || undefined,
    author: plan.user?.username
      ? {
          '@type': 'Person',
          name: plan.user.username,
          image: plan.user.avatarUrl || undefined,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: '福岡遊び日記',
      logo: {
        '@type': 'ImageObject',
        url: 'https://fukuoka-asobi.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://fukuoka-asobi.com/plans/${plan.id}`,
    },
  };

  const cleanedData = removeUndefinedValues(structuredData);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanedData) }}
    />
  );
}

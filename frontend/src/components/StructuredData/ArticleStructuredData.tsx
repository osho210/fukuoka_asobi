import { PlayPlan } from '@/__generated__/graphql';

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

  // undefined 値を除去
  const cleanedData = JSON.parse(
    JSON.stringify(structuredData, (_, value) => (value === undefined ? null : value))
  );
  Object.keys(cleanedData).forEach(key => {
    if (cleanedData[key] === null) {
      delete cleanedData[key];
    }
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanedData) }}
    />
  );
}

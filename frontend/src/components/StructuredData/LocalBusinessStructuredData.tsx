import { Spot } from '@/__generated__/graphql';
import { removeUndefinedValues } from '@/lib/structuredDataUtils';

interface LocalBusinessStructuredDataProps {
  spot: Spot;
}

export default function LocalBusinessStructuredData({ spot }: LocalBusinessStructuredDataProps) {
  // 営業時間のフォーマット
  const formatOpeningHours = () => {
    if (!spot.openingHours || spot.openingHours.length === 0) return undefined;

    const daysMap: { [key: string]: string } = {
      '0': 'Sunday',
      '1': 'Monday',
      '2': 'Tuesday',
      '3': 'Wednesday',
      '4': 'Thursday',
      '5': 'Friday',
      '6': 'Saturday',
    };

    return spot.openingHours
      .filter(hour => !hour.isClosedDay)
      .map(hour => {
        const day = daysMap[hour.dayOfWeek];
        return `${day} ${hour.openTime}-${hour.closeTime}`;
      });
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: spot.spotName,
    description: spot.catchphrase || spot.editorialSummary || spot.generativeSummary || undefined,
    image: spot.imageUrl?.url || spot.imageUrls?.[0]?.url || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: spot.address || spot.shortFormattedAddress || undefined,
      addressLocality: spot.district?.districtName || '福岡市',
      addressRegion: '福岡県',
      addressCountry: 'JP',
    },
    geo: spot.latitude && spot.longitude
      ? {
          '@type': 'GeoCoordinates',
          latitude: spot.latitude,
          longitude: spot.longitude,
        }
      : undefined,
    url: spot.website || spot.googleMapsUri || undefined,
    telephone: spot.phoneNumber || spot.internationalPhoneNumber || undefined,
    priceRange: spot.budgetRange || 
      (spot.priceRangeStartAmount && spot.priceRangeEndAmount 
        ? `¥${spot.priceRangeStartAmount}-¥${spot.priceRangeEndAmount}` 
        : undefined),
    openingHoursSpecification: formatOpeningHours()?.map(hours => {
      const [days, times] = hours.split(' ');
      const [open, close] = times.split('-');
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days,
        opens: open,
        closes: close,
      };
    }) || undefined,
    aggregateRating: spot.reviewCount && spot.reviewRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: spot.reviewRating,
          reviewCount: spot.reviewCount,
        }
      : undefined,
    servesCuisine: spot.categories?.map(cat => cat.name).join(', ') || undefined,
    acceptsReservations: spot.reservable ? true : undefined,
    paymentAccepted: spot.acceptsCreditCards || spot.acceptsDebitCards || spot.acceptsNfc
      ? [
          spot.acceptsCreditCards && 'Credit Card',
          spot.acceptsDebitCards && 'Debit Card',
          spot.acceptsCashOnly && 'Cash',
          spot.acceptsNfc && 'NFC',
        ].filter(Boolean).join(', ')
      : undefined,
  };

  const cleanedData = removeUndefinedValues(structuredData);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanedData) }}
    />
  );
}

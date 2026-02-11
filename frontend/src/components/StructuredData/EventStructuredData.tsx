import { Event, StatusEnum } from '@/__generated__/graphql';

interface EventStructuredDataProps {
  event: Event;
}

export default function EventStructuredData({ event }: EventStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description || undefined,
    startDate: event.startDatetime,
    endDate: event.endDatetime || undefined,
    eventStatus: event.status === StatusEnum.Published 
      ? 'https://schema.org/EventScheduled' 
      : 'https://schema.org/EventCancelled',
    eventAttendanceMode: event.isOnline 
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: event.isOnline
      ? {
          '@type': 'VirtualLocation',
          url: event.sourceUrl || undefined,
        }
      : {
          '@type': 'Place',
          name: event.location || undefined,
          address: event.location || undefined,
          ...(event.latitude && event.longitude
            ? {
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: event.latitude,
                  longitude: event.longitude,
                },
              }
            : {}),
        },
    image: event.bannerImage || undefined,
    organizer: event.organizer
      ? {
          '@type': 'Organization',
          name: event.organizer,
          email: event.contactEmail || undefined,
          telephone: event.contactPhone || undefined,
        }
      : undefined,
    offers: event.price
      ? {
          '@type': 'Offer',
          price: event.price,
          priceCurrency: 'JPY',
          availability: 'https://schema.org/InStock',
          validFrom: event.startDatetime,
        }
      : undefined,
    performer: event.organizer
      ? {
          '@type': 'Organization',
          name: event.organizer,
        }
      : undefined,
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

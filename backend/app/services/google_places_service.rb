class GooglePlacesService
  include HTTParty
  base_uri 'https://places.googleapis.com/v1'

  def initialize
    @api_key = Rails.application.credentials.google_places_api_key
    raise 'Google Places API key not found' unless @api_key
  end

  # テキスト検索でスポットを検索
  def search_places(query, location: nil, radius: nil)
    body = {
      textQuery: query + ' 福岡',
      maxResultCount: 20
    }

    # 位置情報が指定されている場合
    if location && location[:lat] && location[:lng]
      body[:locationBias] = {
        circle: {
          center: {
            latitude: location[:lat],
            longitude: location[:lng]
          },
          radius: radius || 5000 # デフォルト5km
        }
      }
    end

    response = self.class.post(
      '/places:searchText',
      headers: headers,
      body: body.to_json
    )

    handle_response(response)
  end

  # Place IDから詳細情報を取得
  def get_place_details(place_id)
    response = self.class.get(
      "/places/#{place_id}",
      headers: headers
    )

    handle_response(response)
  end

  # 写真を取得
  def get_place_photo(photo_reference, max_width: 400, max_height: 400)
    response = self.class.get(
      "/places/#{photo_reference}/media",
      headers: photo_headers,
      query: {
        maxWidthPx: max_width,
        maxHeightPx: max_height
      }
    )

    return response.body if response.success?
    nil
  end

  private

  def headers
    {
      'Content-Type' => 'application/json',
      'X-Goog-Api-Key' => @api_key,
      'X-Goog-FieldMask' => field_mask
    }
  end

  def photo_headers
    {
      'X-Goog-Api-Key' => @api_key
    }
  end

  def field_mask
    # 必要なフィールドを指定
    [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.shortFormattedAddress',
      'places.adrFormatAddress',
      'places.nationalPhoneNumber',
      'places.internationalPhoneNumber',
      'places.rating',
      'places.userRatingCount',
      'places.websiteUri',
      'places.googleMapsUri',
      'places.regularOpeningHours',
      'places.currentOpeningHours',
      'places.regularSecondaryOpeningHours',
      'places.currentSecondaryOpeningHours',
      'places.timeZone',
      'places.utcOffsetMinutes',
      'places.photos',
      'places.businessStatus',
      'places.priceLevel',
      'places.types',
      'places.primaryType',
      'places.primaryTypeDisplayName',
      'places.location',
      'places.viewport',
      'places.iconMaskBaseUri',
      'places.iconBackgroundColor',
      'places.paymentOptions',
      'places.parkingOptions',
      'places.generativeSummary',
      'places.editorialSummary',
      'places.priceRange',
      'places.reviewSummary',
      'places.accessibilityOptions',
      'places.takeout',
      'places.delivery',
      'places.dineIn',
      'places.curbsidePickup',
      'places.reservable',
      'places.servesBreakfast',
      'places.servesLunch',
      'places.servesDinner',
      'places.servesBrunch',
      'places.servesBeer',
      'places.servesWine',
      'places.servesVegetarianFood',
      'places.outdoorSeating',
      'places.liveMusic',
      'places.menuForChildren',
      'places.servesCocktails',
      'places.servesDessert',
      'places.servesCoffee',
      'places.goodForChildren',
      'places.allowsDogs',
      'places.restroom',
      'places.goodForGroups',
      'places.goodForWatchingSports',
      'places.pureServiceAreaBusiness'
    ].join(',')
  end

  def handle_response(response)
    case response.code
    when 200
      response.parsed_response
    when 400
      Rails.logger.error "Google Places API Bad Request: #{response.body}"
      { error: 'Bad Request', details: response.body }
    when 401
      Rails.logger.error "Google Places API Unauthorized: #{response.body}"
      { error: 'Unauthorized', details: response.body }
    when 403
      Rails.logger.error "Google Places API Forbidden: #{response.body}"
      { error: 'Forbidden', details: response.body }
    when 429
      Rails.logger.error "Google Places API Rate Limited: #{response.body}"
      { error: 'Rate Limited', details: response.body }
    else
      Rails.logger.error "Google Places API Error: #{response.code} - #{response.body}"
      { error: 'API Error', code: response.code, details: response.body }
    end
  end
end

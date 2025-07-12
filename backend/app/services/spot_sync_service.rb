class SpotSyncService
  def initialize(spot)
    @spot = spot
    @google_places_service = GooglePlacesService.new
  end

  def sync_with_google_places(google_place_id)
    place_details = @google_places_service.get_place_details(google_place_id)

    return false if place_details.nil? || place_details['error'].present?

    update_spot_with_place_details(place_details)
    true
  rescue => e
    Rails.logger.error "SpotSyncService Error: #{e.message}"
    false
  end

  private

  def update_spot_with_place_details(details)
    @spot.update!(
      google_place_id: details['id'],
      spot_name: details.dig('displayName', 'text') || @spot.spot_name,
      address: details['formattedAddress'],
      phone_number: details['nationalPhoneNumber'],
      website: details['websiteUri'],
      latitude: details.dig('location', 'latitude'),
      longitude: details.dig('location', 'longitude'),
      review_rating: details['rating'],
      review_count: details['userRatingCount'],
      business_status: details['businessStatus']&.downcase,
      price_level: details['priceLevel']&.downcase,
      google_maps_uri: details['googleMapsUri'],
      primary_type: details['primaryType'],
      primary_type_display_name: details.dig('primaryTypeDisplayName', 'text'),
      international_phone_number: details['internationalPhoneNumber'],
      short_formatted_address: details['shortFormattedAddress'],

      # サービス提供情報
      takeout: details['takeout'],
      delivery: details['delivery'],
      dine_in: details['dineIn'],
      reservable: details['reservable'],
      serves_breakfast: details['servesBreakfast'],
      serves_lunch: details['servesLunch'],
      serves_dinner: details['servesDinner'],
      serves_brunch: details['servesBrunch'],
      serves_beer: details['servesBeer'],
      serves_wine: details['servesWine'],
      serves_vegetarian_food: details['servesVegetarianFood'],
      outdoor_seating: details['outdoorSeating'],
      live_music: details['liveMusic'],
      menu_for_children: details['menuForChildren'],
      serves_cocktails: details['servesCocktails'],
      serves_dessert: details['servesDessert'],
      serves_coffee: details['servesCoffee'],
      good_for_children: details['goodForChildren'],
      allows_dogs: details['allowsDogs'],
      restroom: details['restroom'],
      good_for_groups: details['goodForGroups'],
      good_for_watching_sports: details['goodForWatchingSports'],

      last_api_sync_at: Time.current,
      api_sync_status: 'success'
    )
  end
end

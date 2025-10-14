require 'rails_helper'

RSpec.describe Types::ImagePropertyType do
  describe 'fields' do
    subject { described_class }

    it { is_expected.to have_field(:attachment_id).of_type('ID!') }
    it { is_expected.to have_field(:url).of_type('String!') }
    it { is_expected.to have_field(:is_selected).of_type('Boolean!') }
    it { is_expected.to have_field(:position).of_type('Int!') }
    it { is_expected.to have_field(:comment).of_type('String') }
  end
end

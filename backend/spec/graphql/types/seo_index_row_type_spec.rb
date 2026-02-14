# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::SeoIndexRowType do
  subject { described_class }

  it { is_expected.to have_field(:id).of_type('ID!') }
  it { is_expected.to have_field(:title).of_type('String!') }
  it { is_expected.to have_field(:type).of_type('String!') }
  it { is_expected.to have_field(:status).of_type('String!') }
  it { is_expected.to have_field(:is_indexable).of_type('Boolean!') }
  it { is_expected.to have_field(:url).of_type('String!') }
  it { is_expected.to have_field(:updated_at).of_type('ISO8601DateTime!') }
end

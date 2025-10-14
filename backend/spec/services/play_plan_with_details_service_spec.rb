require 'rails_helper'

RSpec.describe PlayPlanWithDetailsService do
  let(:user) { create(:user) }
  let(:play_plan) { create(:play_plan, user: user) }

  describe '#execute' do
    context 'when updating image properties' do
      let!(:attachment1) { create(:active_storage_attachment) }
      let!(:attachment2) { create(:active_storage_attachment) }

      before do
        # PlayPlanにattachmentを関連付け（モック）
        allow(play_plan).to receive(:images).and_return(
          double('images', find_by: attachment1)
        )
      end

      let(:params) do
        {
          id: play_plan.id,
          plan_name: 'Test Plan',
          status: 'published',
          trip_type: 'day_trip',
          plan_details: [
            {
              step_number: 1,
              step_name: 'Step 1',
              step_description: 'Description 1'
            }
          ],
          image_properties: [
            {
              attachment_id: attachment1.id,
              is_selected: true,
              position: 1,
              comment: 'Test comment'
            }
          ]
        }
      end

      subject { described_class.new(params, user) }

      it 'processes image properties successfully' do
        expect {
          subject.execute
        }.to change(PlayPlanImageProperty, :count).by(1)

        property = PlayPlanImageProperty.last
        expect(property.play_plan_id).to eq(play_plan.id)
        expect(property.attachment_id).to eq(attachment1.id)
        expect(property.is_selected).to be true
        expect(property.position).to eq(1)
        expect(property.comment).to eq('Test comment')
      end

      context 'when exceeding selection limit' do
        let(:params_with_too_many_selected) do
          params.merge(
            image_properties: [
              { attachment_id: attachment1.id, is_selected: true, position: 1, comment: nil },
              { attachment_id: attachment2.id, is_selected: true, position: 2, comment: nil },
              { attachment_id: attachment1.id, is_selected: true, position: 3, comment: nil },
              { attachment_id: attachment2.id, is_selected: true, position: 4, comment: nil }
            ]
          )
        end

        subject { described_class.new(params_with_too_many_selected, user) }

        it 'returns error when selection limit exceeded' do
          result = subject.execute

          expect(result[:success]).to be false
          expect(result[:errors]).to include(
            hash_including(
              field: 'image_properties',
              message: "選択できる画像は#{PlayPlan::MAX_SELECTED_IMAGES}枚までです。"
            )
          )
        end
      end

      context 'when attachment does not exist' do
        let(:params_with_invalid_attachment) do
          params.merge(
            image_properties: [
              {
                attachment_id: 99999,
                is_selected: true,
                position: 1,
                comment: 'Test comment'
              }
            ]
          )
        end

        before do
          allow(play_plan).to receive(:images).and_return(
            double('images', find_by: nil)
          )
        end

        subject { described_class.new(params_with_invalid_attachment, user) }

        it 'returns error for invalid attachment' do
          result = subject.execute

          expect(result[:success]).to be false
          expect(result[:errors]).to include(
            hash_including(
              field: 'image_properties[0].attachment_id',
              message: '指定された画像が見つかりません'
            )
          )
        end
      end
    end
  end
end

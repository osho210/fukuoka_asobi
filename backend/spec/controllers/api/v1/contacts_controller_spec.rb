require 'rails_helper'

RSpec.describe Api::V1::ContactsController, type: :controller do
  describe 'POST #create' do
    context '有効なパラメータの場合' do
      let(:valid_params) do
        {
          contact: {
            email: 'test@example.com',
            subject: 'テストの件名',
            inquiry_type: 'general',
            message: 'これはテストメッセージです。',
            privacy_policy: true
          }
        }
      end

      it '新しいお問い合わせを作成すること' do
        expect {
          post :create, params: valid_params
        }.to change(Contact, :count).by(1)
      end

      it '成功レスポンスを返すこと' do
        post :create, params: valid_params
        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['message']).to eq('送信完了')
      end
    end

    context '無効なパラメータの場合' do
      let(:invalid_params) do
        {
          contact: {
            email: 'invalid-email',
            subject: '',
            inquiry_type: 'invalid_type',
            message: '',
            privacy_policy: false
          }
        }
      end

      it '新しいお問い合わせを作成しないこと' do
        expect {
          post :create, params: invalid_params
        }.not_to change(Contact, :count)
      end

      it 'エラーレスポンスを返すこと' do
        post :create, params: invalid_params
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['errors']).to be_present
      end
    end
  end

  describe 'GET #index' do
    before do
      # テスト前にデータベースをクリアして、正確に3件のお問い合わせを作成
      Contact.destroy_all
      create_list(:contact, 3)
    end

    it 'お問い合わせ一覧を返すこと' do
      get :index
      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
      expect(json_response['contacts'].size).to eq(3)
    end
  end

  describe 'GET #show' do
    let(:contact) { create(:contact) }

    context '存在するお問い合わせIDの場合' do
      it 'お問い合わせ詳細を返すこと' do
        get :show, params: { id: contact.id }
        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['contact']['id']).to eq(contact.id)
      end
    end

    context '存在しないお問い合わせIDの場合' do
      it 'not foundエラーを返すこと' do
        get :show, params: { id: 999 }
        expect(response).to have_http_status(:not_found)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['message']).to eq('お問い合わせが見つかりません')
      end
    end
  end
end

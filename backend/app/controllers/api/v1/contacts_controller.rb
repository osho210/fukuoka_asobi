module Api
  module V1
    class ContactsController < ApplicationController
      # APIコントローラーなのでCSRF対策をスキップする
      skip_before_action :verify_authenticity_token

      # POST /api/v1/contact
      def create
        @contact = Contact.new(contact_params)

        if @contact.save
          render json: { success: true, message: "送信完了" }, status: :ok
        else
          render json: { success: false, errors: @contact.errors.full_messages }, status: :unprocessable_entity
        end
      rescue StandardError => e
        render json: { success: false, message: "エラーが発生しました" }, status: :internal_server_error
      end

      # GET /api/v1/contacts
      # 管理画面用のAPI
      def index
        @contacts = Contact.all.order(created_at: :desc)
        render json: { success: true, contacts: @contacts }, status: :ok
      rescue StandardError => e
        render json: { success: false, message: "エラーが発生しました" }, status: :internal_server_error
      end

      # GET /api/v1/contacts/:id
      # 管理画面用のAPI
      def show
        @contact = Contact.find(params[:id])
        render json: { success: true, contact: @contact }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { success: false, message: "お問い合わせが見つかりません" }, status: :not_found
      rescue StandardError => e
        render json: { success: false, message: "エラーが発生しました" }, status: :internal_server_error
      end

      private

      def contact_params
        params.require(:contact).permit(:email, :subject, :inquiry_type, :message, :privacy_policy)
      end
    end
  end
end

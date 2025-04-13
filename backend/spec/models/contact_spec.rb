require 'rails_helper'

RSpec.describe Contact, type: :model do
  describe 'バリデーション' do
    let(:contact) { build(:contact) }

    it '有効なファクトリを持つこと' do
      expect(contact).to be_valid
    end

    context 'email' do
      it '空の場合は無効であること' do
        contact.email = nil
        expect(contact).to be_invalid
        expect(contact.errors[:email]).to include("を入力してください")
      end

      it '不正な形式の場合は無効であること' do
        contact.email = 'invalid-email'
        expect(contact).to be_invalid
        expect(contact.errors[:email]).to include("は不正な値です")
      end
    end

    context 'subject' do
      it '空の場合は無効であること' do
        contact.subject = nil
        expect(contact).to be_invalid
        expect(contact.errors[:subject]).to include("を入力してください")
      end

      it '50文字を超える場合は無効であること' do
        contact.subject = 'a' * 51
        expect(contact).to be_invalid
        expect(contact.errors[:subject]).to include("は50文字以内で入力してください")
      end
    end

    context 'inquiry_type' do
      it '空の場合は無効であること' do
        contact.inquiry_type = nil
        expect(contact).to be_invalid
        expect(contact.errors[:inquiry_type]).to include("を入力してください")
      end

      it '許可されていない値の場合は無効であること' do
        contact.inquiry_type = '無効な種類'
        expect(contact).to be_invalid
        expect(contact.errors[:inquiry_type]).to include("は一覧にありません")
      end

      it '許可された値の場合は有効であること' do
        %w[general business media error other].each do |type|
          contact.inquiry_type = type
          expect(contact).to be_valid
        end
      end
    end

    context 'message' do
      it '空の場合は無効であること' do
        contact.message = nil
        expect(contact).to be_invalid
        expect(contact.errors[:message]).to include("を入力してください")
      end

      it '500文字を超える場合は無効であること' do
        contact.message = 'a' * 501
        expect(contact).to be_invalid
        expect(contact.errors[:message]).to include("は500文字以内で入力してください")
      end
    end

    context 'privacy_policy' do
      it 'falseの場合は無効であること' do
        contact.privacy_policy = false
        expect(contact).to be_invalid
        expect(contact.errors[:privacy_policy]).to include("に同意してください")
      end
    end
  end
end

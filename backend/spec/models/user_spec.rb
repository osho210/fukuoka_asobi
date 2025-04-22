# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'アバター画像' do
    let(:user) { create(:user) }

    it 'アバター画像をアタッチできること' do
      # テスト用の画像データを作成（インメモリ）
      file = StringIO.new('dummy image content')
      file.class.class_eval { attr_accessor :original_filename, :content_type }
      file.original_filename = 'test_avatar.jpg'
      file.content_type = 'image/jpeg'

      # アバターをアタッチ
      user.avatar.attach(io: file, filename: 'test_avatar.jpg', content_type: 'image/jpeg')

      # アタッチされたことを確認
      expect(user.avatar).to be_attached
    end

    it 'アバター画像を削除できること' do
      # テスト用の画像データを作成（インメモリ）
      file = StringIO.new('dummy image content')
      file.class.class_eval { attr_accessor :original_filename, :content_type }
      file.original_filename = 'test_avatar.jpg'
      file.content_type = 'image/jpeg'

      # アバターをアタッチ
      user.avatar.attach(io: file, filename: 'test_avatar.jpg', content_type: 'image/jpeg')

      # アバターを削除
      user.avatar.purge

      # 削除されたことを確認
      expect(user.avatar).not_to be_attached
    end
  end
end

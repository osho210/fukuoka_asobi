class ApplicationController < ActionController::Base
  # TODO: 現在はブラウザの機能を利用した制限は行っていないため制限は不要、指定する場合はコメントアウトを削除
  # allow_browser versions: { safari: 16.4, firefox: 121, ie: false, chrome: 119 }
  rescue_from StandardError do |exception|
    Rails.logger.error "[#{exception.class}] #{exception.message}"
    Rails.logger.error exception.backtrace.join("\n")

    render json: {
      success: false,
      message: 'サーバーでエラーが発生しました。しばらくしてから再度お試しください'
    }, status: :internal_server_error
  end
end

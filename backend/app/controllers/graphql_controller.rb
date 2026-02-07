# frozen_string_literal: true

class GraphqlController < ApplicationController
  include Authentication

  # If accessing from outside this domain, nullify the session
  # This allows for outside API access while preventing CSRF attacks,
  # but you'll have to authenticate your user separately
  # protect_from_forgery with: :null_session

  # GraphQL専用のコントローラで、CSRFチェックをスキップ
  skip_before_action :verify_authenticity_token, only: :execute

  def current_user
    @current_user ||= current_user_from_cookie
  end

  def execute
    variables = prepare_variables(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]
    context = {
      # Query context goes here, for example:
      current_user: current_user,
      controller: self,
      is_admin_request: admin_request?
    }
    result = BackendSchema.execute(query, variables: variables, context: context, operation_name: operation_name)
    render json: result
  rescue StandardError => e
    raise e unless Rails.env.development?
    handle_error_in_development(e)
  end

  private

  # Handle variables in form data, JSON body, or a blank value
  def prepare_variables(variables_param)
    case variables_param
    when String
      if variables_param.present?
        JSON.parse(variables_param) || {}
      else
        {}
      end
    when Hash
      variables_param
    when ActionController::Parameters
      variables_param.to_unsafe_hash # GraphQL-Ruby will validate name and type of incoming variables.
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{variables_param}"
    end
  end

  # admin リクエストかどうかを判定
  def admin_request?
    # リクエスト元のホスト名で判定（例: admin.example.com）
    # または Authorization ヘッダーの admin トークンで判定
    request.host.start_with?('admin') || request.headers['X-Admin-Request'] == 'true'
  end

  def handle_error_in_development(e)
    logger.error e.message
    logger.error e.backtrace.join("\n")

    render json: { errors: [{ message: e.message, backtrace: e.backtrace }], data: {} }, status: 500
  end
end

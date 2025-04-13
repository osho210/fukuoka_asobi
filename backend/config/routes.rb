Rails.application.routes.draw do
  # Deviseのルーティング（APIモード用に設定）
  devise_for :users, skip: :all

  # GraphQLエンドポイント
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
    mount LetterOpenerWeb::Engine, at: "/letter_opener"
  end
  post "/graphql", to: "graphql#execute"

  # API用のルーティング
  namespace :api do
    # パスワードリセット
    post 'password/forgot', to: 'passwords#forgot'
    post 'password/reset', to: 'passwords#reset'

    namespace :v1 do
      # 認証関連
      post 'login', to: 'sessions#create'
      post 'signup', to: 'auth#signup'
      delete 'logout', to: 'sessions#destroy'

      # ユーザー情報
      get 'login_user', to: 'users#login_user'
    end
  end

  # ヘルスチェック
  get "up" => "rails/health#show", as: :rails_health_check
end

class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("DEFAULT_FROM_EMAIL", "noreply@fukuoka-asobi.com")
  layout "mailer"
end

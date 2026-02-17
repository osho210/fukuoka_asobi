class ChangeConsentAgreementIdToOptionalInLicensedAssets < ActiveRecord::Migration[8.0]
  def change
    change_column_null :licensed_assets, :consent_agreement_id, true
  end
end

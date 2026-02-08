'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { formatTimeFromIso } from '../../lib/dateUtils';
import { OpeningHour, Spot, PlanDetail } from '@/__generated__/graphql';

export interface District {
  districtName: string;
}

/* ============================================
   Utility（IIFE）: URL正規化
   ============================================ */
/**
 * URL文字列をできる限り正規化して比較しやすくします。
 * - 末尾のスラッシュを除去
 * - 失敗時はtrimのみ
 * @returns (raw: string | undefined) => string
 */
const normalizeUrl = (() => {
  return (raw: string | undefined): string => {
    if (!raw) return '';
    try {
      const url = new URL(raw);
      url.pathname = url.pathname.replace(/\/+$/, '');
      return url.toString();
    } catch {
      return raw.trim().replace(/\/+$/, '');
    }
  };
})();

/* ============================================
   Utility（IIFE）: 表示判断（Instagram/Website）
   ============================================ */
/**
 * Instagram と Website の表示可否を判断します。
 * ルール:
 * - どちらも同じURLなら Website のみ表示
 * - それ以外は個別に存在する方を表示
 */
const decideWhichLinksToShow = (() => {
  return (spot: Spot) => {
    // Instagram と Website のURLが存在する場合のみ正規化
    if (!spot.instagramUrl || !spot.website) return { showInstagramUrl: '', showWebsiteUrl: '' };
    const instagramUrlNormalized = normalizeUrl(spot?.instagramUrl);
    const websiteUrlNormalized = normalizeUrl(spot?.website);

    const bothExistAndSame =
      normalizeUrl(spot?.instagramUrl) === normalizeUrl(spot?.website);

    return {
      showInstagramUrl: instagramUrlNormalized && !bothExistAndSame ? instagramUrlNormalized : '',
      showWebsiteUrl: websiteUrlNormalized ? websiteUrlNormalized : '',
    };
  };
})();

/* ============================================
   Utility（IIFE）: 営業時間の整形
   ============================================ */
/**
 * 営業時間の配列を表示用に整形します。
 * ※ 曜日は既に「日・月…」で渡される前提なので、ここでは順序変更は行いません。
 * 空配列 or undefined の場合は空配列を返します。
 */
const formatOpeningHours = (() => {
  return (openingHours: OpeningHour[] | undefined): OpeningHour[] => {
    return Array.isArray(openingHours) ? openingHours : [];
  };
})();

/* ============================================
   UI: タブ種別
   ============================================ */
type TabIdentifier = 'basicInfo' | 'openingHours' | 'shopDetail';

const TABS: { key: TabIdentifier; label: string }[] = [
  { key: 'basicInfo', label: '店舗情報' },   // 初期表示
  { key: 'openingHours', label: '営業時間' },
  { key: 'shopDetail', label: '店舗詳細' },
];

/* ============================================
   UI: タブバー（表示のみ）
   ============================================ */
function TabsBar({
  currentTab,
  onChangeTab,
}: {
  currentTab: TabIdentifier;
  onChangeTab: (key: TabIdentifier) => void;
}) {
  return (
    <div className="spot-tabs" role="tablist" aria-label="店舗情報タブ">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          role="tab"
          aria-selected={currentTab === key}
          className={`spot-tab ${currentTab === key ? 'is-active' : ''}`}
          onClick={() => onChangeTab(key)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ============================================
   UI: タブ内容（表示のみ）
   ============================================ */
function BasicInfoTab({
  detail,
  showInstagramUrl,
  showWebsiteUrl,
}: {
  detail: PlanDetail;
  showInstagramUrl: string;
  showWebsiteUrl: string;
}) {
  const spot = detail.spot;

  return (
    <div className="plan-step-spot-details">
      {spot?.address && (
        <div className="plan-step-spot-detail">
          <Image src="/pin-icon.png" alt="ピンアイコン" width={24} height={24} />
          <span>{spot.address}</span>
        </div>
      )}

      {spot?.phoneNumber && (
        <div className="plan-step-spot-detail">
          <Image src="/phone-icon.png" alt="電話アイコン" width={24} height={24} />
          <span>{spot.phoneNumber}</span>
        </div>
      )}

      {spot?.nearestStation && (
        <div className="plan-step-spot-detail">
          <Image src="/train-icon.png" alt="電車アイコン" width={24} height={24} />
          <span>最寄駅: {spot.nearestStation}駅</span>
        </div>
      )}

      {showInstagramUrl && (
        <div className="plan-step-spot-detail">
          <Image src="/Instagram-logo-page.svg" alt="インスタグラムアイコン" width={22} height={22} />
          <a href={showInstagramUrl} target="_blank" rel="noopener noreferrer">
            {showInstagramUrl}
          </a>
        </div>
      )}

      {showWebsiteUrl && (
        <div className="plan-step-spot-detail">
          <Image src="/website-icon.png" alt="ウェブサイトアイコン" width={24} height={24} />
          <a href={showWebsiteUrl} target="_blank" rel="noopener noreferrer">
            {showWebsiteUrl}
          </a>
        </div>
      )}
    </div>
  );
}

function OpeningHoursTab({ openingHours }: { openingHours?: OpeningHour[] }) {
  const openingHoursRows = formatOpeningHours(openingHours);

  if (!openingHoursRows.length) {
    return <div className="spot-tab-body-empty">営業時間の登録がありません</div>;
  }
  return (
    <div className="plan-step-spot-details">
      <div className="spot-hours">
        {openingHoursRows.map((hour, index) => (
          <div key={`${hour.dayOfWeek}-${index}`} className="spot-hours-row">
            <span className="spot-hours-day">{hour.dayOfWeek}</span>
            <span className="spot-hours-time">
              {formatTimeFromIso(hour.openTime)} – {formatTimeFromIso(hour.closeTime)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShopDetailTab({ detail }: { detail: PlanDetail }) {
  return (
    <div className="plan-step-spot-details">
      {/* 予算の範囲 */}
      {detail.spot?.priceRangeStartAmount && detail.spot?.priceRangeEndAmount && (
        <div className="plan-step-spot-detail">
          <Image src="/money-icon.png" alt="予算アイコン" width={24} height={24} />
          <span>予算の目安:{detail.spot.priceRangeStartAmount}円 ~ {detail.spot.priceRangeEndAmount}円</span>
        </div>
      )}

      {/* メニュー情報 */}
      {detail.spot?.menus && detail.spot.menus.length > 0 && (
        <div className="plan-step-spot-detail">
          <Image src="/menu-icon.png" alt="メニューアイコン" width={24} height={24} />
          <ul className="spot-item-lists">
            {detail.spot.menus.map((menu, index) => (
              <li className='spot-item-list' key={menu.id + '-' + index}>{menu.menuName}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 雰囲気 */}
      {detail.spot?.spotAmbiances && detail.spot.spotAmbiances.length > 0 && (
        <div className="plan-step-spot-detail">
          <Image src="/atmosphere-icon.png" alt="雰囲気アイコン" width={24} height={24} />
          <ul className="spot-item-lists">
            {detail.spot.spotAmbiances.map((ambiance, index) => (
              <li className='spot-item-list' key={ambiance.id + "-" + index}>{ambiance.ambianceName}</li>
            ))}
          </ul>
        </div>
      )}

      {/* カテゴリ */}
      {detail.spot?.categories && detail.spot.categories.length > 0 && (
        <div className="plan-step-spot-detail">
          <Image src="/magazine-icon.png" alt="カテゴリアイコン" width={24} height={24} />
          <ul className="spot-item-lists">
            {detail.spot.categories.map((category, index) => (
              <li className='spot-item-list' key={category.id + "-" + index}>{category.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ハッシュタグ */}
      {detail.spot?.hashtags && detail.spot.hashtags.length > 0 && (
        <div className="plan-step-spot-detail">
          <Image src="/hashtag-icon.png" alt="ハッシュタグアイコン" width={24} height={24} />
          <ul className="spot-item-lists">
            {detail.spot.hashtags.map((hashtag, index) => (
              <li className='spot-item-list' key={hashtag.id + "-" + index}>#{hashtag.hashtagName}</li>
            ))}
          </ul>
        </div>
      )}

      <p className='plan-step-spot-option'>オプション</p>
      <div className="plan-step-spot-detail">
        {/* 予約可否 */}
        {detail.spot?.reservable && (
          <p className="spot-extra-value">
            <Image src="/reserve-icon.png" alt="予約アイコン" width={24} height={24} />
            <span>予約可能</span>
          </p>
        )}

        {/* テイクアウト可否 */}
        {detail.spot?.takeout && (
          <p className="spot-extra-value">
            <Image src="/take-out-icon.png" alt="テイクアウトアイコン" width={24} height={24} />
            <span>テイクアウト可能</span>
          </p>
        )}
        {/* 雨の日OK */}
        {detail.spot?.isRainyOk && (
          <p className="spot-extra-value">
            <Image src="/umbrella-icon.png" alt="雨の日OKアイコン" width={24} height={24} />
            <span>雨の日にもおすすめ</span>
          </p>
        )}
      </div>
    </div>
  );
}

/* ============================================
   コンテナ: 状態とロジックを保持
   ============================================ */
export default function SpotInfoTabs({ detail }: { detail: PlanDetail }) {
  const [currentTab, setCurrentTab] = useState<TabIdentifier>('basicInfo');

  const { showInstagramUrl, showWebsiteUrl } = useMemo(
    () => detail.spot ? decideWhichLinksToShow(detail.spot) : { showInstagramUrl: '', showWebsiteUrl: '' },
    [detail.spot]
  );

  return (
    <section className="spot-info">
      <div className="plan-step-spot">
        <div className="plan-step-spot-header">
          <div>
            {detail?.spot?.catchphrase && (
              <p className="plan-step-spot-catchphrase">
                {detail?.spot?.catchphrase}
              </p>
            )}
            <p className="plan-spot-name">{detail?.spot?.spotName}</p>
          </div>
          <div className="plan-step-timeline">
            <Image
              className="plan-step-timeline-image"
              src={'/ashirai.svg'}
              alt={'ashirai'}
              width={30}
              height={30}
              style={{ width: 'auto', height: 'auto' }}
            />
            <div className="plan-step-number">step<br />{detail.stepNumber}</div>
          </div>
        </div>
        <div className='plan-step-spot-container'>
          {detail?.spot?.imageUrl && (
            <div className="plan-step-spot-image">
              <Image
                src={detail?.spot?.imageUrl.url}
                alt={detail?.spot?.spotName}
                width={300}
                height={200}
                className="spot-image"
              />
            </div>
          )}
          {/* stepNameが存在する場合はそれを表示、なければカテゴリを表示 */}
          {detail.stepName ? (
            <p><span className="plan-step-name">{detail.stepName}</span></p>
          ) : (
            detail?.spot?.categories && detail.spot.categories.length > 0 && (
              <p><span className="plan-step-name">{detail.spot.categories[0].name}</span></p>
            )
          )}
          {detail.stepDescription && (
            <div className="plan-step-description">
              {detail.stepDescription}
            </div>
          )}
        </div>
        <TabsBar currentTab={currentTab} onChangeTab={setCurrentTab} />

        <div className="spot-tab-body" role="tabpanel">
          {currentTab === 'basicInfo' && (
            <BasicInfoTab
              detail={detail}
              showInstagramUrl={showInstagramUrl}
              showWebsiteUrl={showWebsiteUrl}
            />
          )}

          {currentTab === 'openingHours' && (
            <OpeningHoursTab openingHours={detail.spot?.openingHours} />
          )}

          {currentTab === 'shopDetail' && <ShopDetailTab detail={detail} />}
        </div>
      </div>

      {/* インスタグラムの埋め込みもできるが、一旦は非活性 */}
      {/* <div>
        <iframe
          className='instagram-media instagram-media-rendered instagram-iframe'
          src={`https://www.instagram.com/店舗名/embed`}>
        </iframe>
      </div> */}

      {detail?.spot?.description && (
        <div className="plan-step-spot-description-container">
          <div className="plan-step-spot-description">
            <p>{detail.spot.description}</p>
          </div>
        </div>
      )}
    </section>
  );
}

import React from 'react';
import { themeConfig } from '@iso/config/theme/theme.config';

export default function TopbarSearch() {
  const customizedTheme = themeConfig.topbar;

  return (
    <div className="searchBoxWrapper">
      <i
        className="ion-ios-search-strong"
        style={{ color: customizedTheme.textColor }}
      />
      <input
        id="InputTopbarSearch"
        placeholder="Type to search..."
      />
    </div>
  );
}

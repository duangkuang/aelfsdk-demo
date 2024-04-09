import { IAelfdThemeProviderProps } from 'aelf-design';
import { ThemeConfig } from 'antd';

export const AELFD_THEME_CONFIG: IAelfdThemeProviderProps['theme'] = {
  token: {
    colorTextHeading: '#070A26',
    colorText: '#070A26',
    colorPrimary: '#070A26',
    colorTextDescription: '#888997',
    colorSplit: '#888997',
    controlHeight: 48,
    colorPrimaryHover: '#9B5EFF',
    colorPrimaryActive: '#863DFF',
    colorBorder: '#070A26',
    colorPrimaryBorder: '#070A26',
    colorError: '#F53F3F',
    colorErrorBorderHover: '#F53F3F',
    colorTextDisabled: '#C1C2C9',
  },
  components: {
    Table: {
      headerBg: '#ffffff',
      headerSplitColor: '#ffffff',
      headerColor: '#070A26',
      borderColor: '#070A26',
      cellPaddingBlock: 21,
      fontWeightStrong: 500,
    },
    Input: {
      activeShadow: '',
      colorBgContainerDisabled: '#FAFAFB',
      colorTextDisabled: '#C1C2C9',
    },
    Tabs: {
      horizontalItemPaddingSM: '13px 0',
      horizontalMargin: '0 0 24px 0',
      inkBarColor: '#863DFF',
      itemActiveColor: '#863DFF',
      itemHoverColor: '#22253E',
      itemSelectedColor: '#863DFF',
    },
    Button: {
      fontWeight: 500,
      colorPrimaryHover: '#22253E',
      colorPrimaryActive: '#131631',
      primaryShadow: '',
      colorPrimary: '#070A26',
      borderColorDisabled: '#EBEBEE',
      colorBgContainerDisabled: '#EBEBEE',
      colorTextDisabled: '#C1C2C9',
    },
    Tooltip: {
      colorBgSpotlight: '#070A26',
      colorTextLightSolid: '#FFF',
    },
    DatePicker: {
      colorBgContainerDisabled: '#FAFAFB',
      colorTextDisabled: '#C1C2C9',
      activeShadow: '',
    },
    Select: {
      colorBgContainerDisabled: '#FAFAFB',
      colorTextDisabled: '#C1C2C9',
    },
  },
};

export const ANTD_THEME_CONFIG: ThemeConfig = {
  token: {
    colorPrimary: '#070A26',
    colorTextDescription: '#888997',
    colorSplit: '#888997',
    controlHeight: 48,
    colorPrimaryHover: '#9B5EFF',
    colorPrimaryActive: '#863DFF',
    colorBorder: '#070A26',
    colorBgSpotlight: '#070A26',
  },
  components: {
    Steps: {
      iconSize: 40,
      iconFontSize: 16,
      titleLineHeight: 40,
      finishIconBorderColor: '#070A26',
    },
    Form: {
      itemMarginBottom: 48,
      labelRequiredMarkColor: '#FF703D',
      labelFontSize: 16,
      verticalLabelMargin: '0 0 4px',
    },
    InputNumber: {
      activeBorderColor: '#863DFF',
      activeShadow: '',
      errorActiveShadow: '',
      warningActiveShadow: '',
      addonBg: '#ffffff',
    },
    Switch: {
      handleShadow: '',
      handleSizeSM: 12,
      trackHeightSM: 16,
      trackMinWidthSM: 28,
      colorPrimaryHover: '#070A26',
    },
    Checkbox: {
      controlInteractiveSize: 16,
    },
    Breadcrumb: {
      itemColor: '#070A26',
      lastItemColor: '#070A26',
      linkColor: '#070A26',
      linkHoverColor: '#070A26',
      separatorColor: '#070A26',
    },
    Tooltip: {
      colorBgSpotlight: '#070A26',
      colorText: '#FFF',
    },
    Message: {
      zIndexPopup: 20000,
    },
    Select: {
      controlOutline: '#FFF',
    },
  },
};

export const AELFD_CUSTOM_TOKEN_CONFIG: IAelfdThemeProviderProps['customToken'] = {
  customAddress: {
    primaryLinkColor: '#863DFF',
    primaryIconColor: '#070A26',
    addressHoverColor: '#863DFF',
    addressActiveColor: '#863DFF',
  },
  customUpload: {
    borderColor: '#070A26',
    colorMessageText: '#070A26',
    containerBg: '#F5F5F6',
  },
  customPagination: {
    colorTextSecondary: '#070A26',
  },
};

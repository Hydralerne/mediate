import HeaderTab from './components/HeaderTab/Main';
import ThemesTab from './components/ThemesTab/Main';
import ContentHeader from './components/ContentHeader';
import SocialTab from './components/HeroTab/Main';

export const getTabComponent = (activeTab, props = {}) => {
  switch (activeTab) {
    case 'content':
      return (
        <ContentHeader
          title="Website Sections"
          subtitle="Drag sections to reorder how they appear on your website"
        />
      );
    case 'header':
      return <HeaderTab />;
    case 'themes':
      return <ThemesTab />;
    case 'social':
      return (
        <SocialTab
          socialLinks={props.socialLinks || []}
          onAddSocialLink={props.onAddSocialLink}
          onRemoveSocialLink={props.onRemoveSocialLink}
        />
      );
    default:
      return null;
  }
}; 
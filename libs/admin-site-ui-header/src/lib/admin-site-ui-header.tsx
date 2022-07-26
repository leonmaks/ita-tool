import styles from './admin-site-ui-header.module.less';

/* eslint-disable-next-line */
export interface AdminSiteUiHeaderProps {}

export function AdminSiteUiHeader(props: AdminSiteUiHeaderProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to AdminSiteUiHeader!</h1>
    </div>
  );
}

export default AdminSiteUiHeader;

import { render } from '@testing-library/react';

import AdminSiteUiHeader from './admin-site-ui-header';

describe('AdminSiteUiHeader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AdminSiteUiHeader />);
    expect(baseElement).toBeTruthy();
  });
});

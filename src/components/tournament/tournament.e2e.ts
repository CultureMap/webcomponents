import { newE2EPage } from '@stencil/core/testing';

describe('cm-tournament', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<cm-tournament></cm-tournament>');

    const element = await page.find('cm-tournament');
    expect(element).toHaveClass('hydrated');
  });
});

interface PageProps {
  menu: MenuLink[],
  contacts: Contact[],
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<PageProps>> {
  context['currentUrl'] = 'contacts';

  return {
    props: {
      menu: await RepositoryFactory
        .get(MenuLinkRepository)
        .getByMenu(context, 'primary'),
      contacts: await RepositoryFactory
        .get(ContactRepository)
        .getAll(context) as Contact[],
    },
  }
}

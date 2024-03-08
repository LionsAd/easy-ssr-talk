export const ContactsPage = () => {
  const [contacts, isLoading, error] = useCachedDataLoader('/node/contact',
    (data) => (getContactsFromResponse(data.data))
  );

  let content = <p>Contacts not found.</p>;
  if (error) {
    content = <p>Error: {error}</p>;
  } else if (isLoading) {
    content = <p>Loading...</p>;
  } else if (contacts) {
    content = <ContactList items={contacts} />
  }

  return (
    <>
      { content }
    </>
  );
};

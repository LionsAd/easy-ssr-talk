export const ContactsPage = () => {
  const [data, isLoading, error] = useDataLoader('/node/contact');

  let content = <p>Contacts not found.</p>;
  if (error) {
    content = <p>Error: {error}</p>;
  } else if (isLoading) {
    content = <p>Loading...</p>;
  } else if (contacts) {
    contacts = getContactsFromResponse(data.data)
    content = <ContactList items={contacts} />
  }

  return (
    <>
      { content }
    </>
  );
};

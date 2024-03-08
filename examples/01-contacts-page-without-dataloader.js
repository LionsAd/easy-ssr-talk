export const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl('/node/contact'));
      if (!response.ok) {
        throw new Error('Error fetching contacts');
      }
      const responseObj = await response.json();
      setContacts(getContactsFromResponse(responseObj.data));
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

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

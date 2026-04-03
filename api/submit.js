export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: 'Missing Supabase config' });
  }

  try {
    const { fields } = req.body;

    const response = await fetch(`${supabaseUrl}/functions/v1/review-application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        name: fields['Name'],
        age: fields['Age'],
        neighborhood: fields['Neighborhood / Borough'],
        school: fields['School'],
        passionate_about: fields['What are you passionate about?'],
        why_join: fields['Why do you want to join?'],
        email: fields['Email'],
        phone: fields['Phone Number'],
      }),
    });

    const data = await response.json();
    // Add `id` field so the frontend's success check (data.id) passes
    if (data.success) return res.status(200).json({ ...data, id: data.decision });
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

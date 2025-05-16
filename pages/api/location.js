export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://api.ipregistry.co/?key=ira_xkvZiz13aqw5LrXR71As4H7kcyIhwA3NFOsB`
    );
    const data = await response.json();

    res.status(200).json({
      city: data.location.region.name,
      country: data.location.country.name,
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy vị trí người dùng" });
  }
}

export const getImageDescription = async (
  thing: string
): Promise<{ message: string; status: number }> => {
  const response = await fetch(
    `/api/v1/image/description?thing=${encodeURIComponent(thing)}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return await response.json()
}

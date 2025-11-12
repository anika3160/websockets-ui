export const parseJSONData = (data: any): any => {
  try {
    return JSON.parse(data)
  } catch (err) {
    console.error('Error parsing JSON:', err)
    return data
  }
}
   
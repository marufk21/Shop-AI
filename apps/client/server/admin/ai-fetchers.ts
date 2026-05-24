import { axiosClient } from "@/server/axios-client"

interface ImproveRequest {
  text: string
  field: "name" | "description"
}

interface ImproveResponse {
  improved_text: string
}

export async function fetchImprovedText(
  text: string,
  field: "name" | "description"
): Promise<string> {
  const { data } = await axiosClient.post<ImproveResponse>(
    "/api/v1/ai/improve",
    { text, field } satisfies ImproveRequest
  )
  return data.improved_text
}

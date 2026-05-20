import { MOCK_DESTINATIONS } from "@/constants/mockData";
import { travelApi } from "./api";

export interface ApiMediaItem {
  type?: string;
  url?: string;
  caption?: string;
}

export interface ApiAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface ApiDestination {
  _id: string;
  name: string;
  description: string;
  category: string;
  media?: ApiMediaItem[];
  location?: {
    type?: string;
    coordinates?: [number, number];
  };
  address?: ApiAddress;
  ratingAverage?: number;
  reviewCount?: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiReview {
  _id: string;
  destinationId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiSavedPlace {
  id: string;
  createdAt?: string;
  destination: ApiDestination;
}

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListDestinationsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const UI_CATEGORY_MAP: Record<string, "hiking" | "kayaking" | "camping" | "surfing"> = {
  Beach: "surfing",
  Surfing: "surfing",
  Mountain: "hiking",
  Hiking: "hiking",
  Adventure: "kayaking",
  Kayaking: "kayaking",
  City: "camping",
  Camping: "camping",
};

const fallbackImages = MOCK_DESTINATIONS.map((destination) => destination.imageUrl);
const fallbackDetails = MOCK_DESTINATIONS[0];

const toStringValue = (value?: string | null, fallback = "Unknown") =>
  value && value.trim().length ? value : fallback;

const mapBackendCategory = (category?: string) =>
  UI_CATEGORY_MAP[category || ""] || "hiking";

const isUsableImageUrl = (value?: string) => {
  if (!value) {
    return false;
  }

  if (!/^https?:\/\//i.test(value)) {
    return false;
  }

  return !/example\.com|cdn\.example\.com/i.test(value);
};

const pickImageUrl = (destination: ApiDestination, index = 0) => {
  const mediaImage = destination.media?.find((item) => isUsableImageUrl(item.url))?.url;
  if (mediaImage) {
    return mediaImage;
  }

  return fallbackImages[index % fallbackImages.length] || fallbackDetails.imageUrl;
};

export const mapDestinationToUi = (
  destination: ApiDestination,
  index = 0,
) => ({
  id: destination._id,
  title: destination.name,
  category: mapBackendCategory(destination.category),
  locationName: toStringValue(destination.address?.city ?? destination.address?.state),
  country: toStringValue(destination.address?.country, "Unknown"),
  rating: destination.ratingAverage ?? 0,
  reviewCount: destination.reviewCount ?? 0,
  description: destination.description,
  pricePerPerson: Math.max(25, Math.round((destination.ratingAverage ?? 4) * 20)),
  availabilityHours: "MON - SUN • 08:00 - 18:00",
  imageUrl: pickImageUrl(destination, index),
  images: [pickImageUrl(destination, index), fallbackDetails.images[1], fallbackDetails.images[2]].filter(Boolean),
  isPopular: (destination.ratingAverage ?? 0) >= 4.7,
  isRecommended: (destination.reviewCount ?? 0) >= 100 || (destination.ratingAverage ?? 0) >= 4.5,
  reviews: fallbackDetails.reviews,
  availabilityCalendar: fallbackDetails.availabilityCalendar,
});

export const mapReviewToUi = (review: ApiReview, index = 0) => {
  const sampleReviews = fallbackDetails.reviews;
  const template = sampleReviews[index % sampleReviews.length];

  return {
    id: review._id,
    userName: template.userName,
    userAvatar: template.userAvatar,
    rating: review.rating,
    comment: review.comment || "",
    date: review.createdAt
      ? new Date(review.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : template.date,
  };
};

export const listDestinations = async (params: ListDestinationsParams = {}) => {
  const response = await travelApi.get<{ data: ApiDestination[]; pagination: ApiPagination }>(
    "/destinations",
    { params },
  );

  return {
    destinations: response.data.data.map((destination, index) =>
      mapDestinationToUi(destination, index),
    ),
    pagination: response.data.pagination,
  };
};

export const getDestination = async (id: string) => {
  const response = await travelApi.get<{ data: ApiDestination }>(`/destinations/${id}`);
  return mapDestinationToUi(response.data.data);
};

export const listDestinationReviews = async (id: string) => {
  const response = await travelApi.get<{ data: ApiReview[] }>(`/destinations/${id}/reviews`);
  return response.data.data.map((review, index) => mapReviewToUi(review, index));
};

export const listSavedPlaces = async () => {
  const response = await travelApi.get<{ data: ApiSavedPlace[] }>("/saved-places");

  return response.data.data.map((savedPlace, index) =>
    mapDestinationToUi(savedPlace.destination, index),
  );
};

export const removeSavedPlace = async (destinationId: string) => {
  await travelApi.delete(`/saved-places/${destinationId}`);
};

export const getCurrentAccount = async () => {
  const response = await travelApi.get<{ data: any }>("/account/me");
  return response.data.data;
};

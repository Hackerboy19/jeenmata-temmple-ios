// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.shrijeenmata.org/api';

// Helper function to get full image URL
export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Remove /api from the base URL to get the server URL, then append the image path
  const serverUrl = API_BASE_URL.replace(/\/api$/, '');
  return `${serverUrl}${imagePath}`;
};

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: UserData;
  error?: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AartiTiming {
  _id: string;
  name: string;
  title: {
    en: string;
    hi: string;
  };
  startTime: string;
  endTime: string;
  description?: {
    en?: string;
    hi?: string;
  };
  image?: string;
  isActive: boolean;
  order: number;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'Planning' | 'Ongoing' | 'Completed' | 'On Hold';
  goal: number;
  achieved: number;
  featured: boolean;
  category?: string;
  startDate?: string;
  completionDate?: string;
  image?: string;
  isActive: boolean;
}

export interface News {
  _id: string;
  title: {
    en: string;
    hi: string;
  };
  excerpt: {
    en: string;
    hi: string;
  };
  content?: {
    en?: string;
    hi?: string;
  };
  category: 'Event' | 'Announcement' | 'Festival' | 'Update' | 'Achievement';
  featured: boolean;
  publishDate: string;
  isActive: boolean;
  image?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Story {
  _id: string;
  title: {
    en: string;
    hi: string;
  };
  content: {
    en: string;
    hi: string;
  };
  author: {
    name: string;
    location: {
      en: string;
      hi: string;
    };
  };
  category: 'Miracle' | 'Devotion' | 'Experience' | 'Blessing' | 'Testimony';
  featured: boolean;
  publishDate: string;
  isActive: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  paymentId: string;
  key: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface Booking {
  _id?: string;
  user?: string;
  bookingType: 'room' | 'prasad' | 'aarti';
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  name: string;
  phone: string;
  email?: string;
  idProof?: string;
  idNumber?: string;
  
  // Room booking fields
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  specialRequirements?: string;
  
  // Prasad booking fields
  deliveryAddress?: string;
  prasadType?: string;
  quantity?: number;
  
  // Aarti participation fields
  aartiDate?: string;
  aartiTime?: string;
  numberOfDevotees?: number;
  specialPrayerRequest?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingResponse extends ApiResponse<Booking> {}
export interface BookingsResponse extends ApiResponse<Booking[]> {
  count?: number;
}

export interface ServiceBooking {
  _id?: string;
  user?: string;
  serviceType: 'divya-darshan' | 'special-pooja' | 'bhog' | 'poshak' | 'accommodation' | 'seva-satkar' | 'sawamani' | 'prasad';
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  
  // Personal Information
  name: string;
  gender?: string;
  nationality?: string;
  mobile: string;
  email?: string;
  membershipId?: string;
  
  // Address Information
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  
  // ID Proof
  idProof?: string;
  idNumber?: string;
  documentFile?: string;
  
  // Service specific fields
  bookingDate?: string;
  poojaDate?: string;
  poojaType?: string;
  bhogType?: string;
  bhogDate?: string;
  poshakType?: string;
  poshakDate?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  roomType?: string;
  prasadType?: string;
  deliveryDate?: string;
  deliveryAddress?: string;
  sevaType?: string;
  sevaDate?: string;
  
  // Payment
  quantity?: number;
  amount: number;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceBookingResponse extends ApiResponse<ServiceBooking> {}
export interface ServiceBookingsResponse extends ApiResponse<ServiceBooking[]> {
  count?: number;
}

export interface GalleryItem {
  _id: string;
  caption: string;
  category: 'Temple' | 'Festival' | 'Aarti' | 'Projects';
  mediaType: 'image' | 'video';
  imageUrl: string;
  imagePublicId?: string;
  fileSize?: number;
  uploadedBy?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryResponse extends ApiResponse<GalleryItem[]> {
  count?: number;
  photos?: GalleryItem[];
}

// Helper function to get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to create headers
const createHeaders = (includeAuth: boolean = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// API Client
export const api = {
  // Auth endpoints
  auth: {
    signup: async (name: string, email: string, password: string): Promise<ApiResponse<UserData>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: createHeaders(),
          body: JSON.stringify({ name, email, password, role: 'user' }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Signup failed');
        }

        // Store token and user in localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    login: async (email: string, password: string): Promise<ApiResponse<UserData>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: createHeaders(),
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // Store token and user in localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    logout: async (): Promise<ApiResponse<null>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: createHeaders(true),
        });

        const data = await response.json();

        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        return data;
      } catch (error) {
        // Even if API call fails, clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw error;
      }
    },

    getMe: async (): Promise<ApiResponse<UserData>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user');
        }

        // Update user in localStorage
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
          method: 'POST',
          headers: createHeaders(),
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to send reset code');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    resetPassword: async (email: string, resetToken: string, newPassword: string): Promise<ApiResponse<null>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
          method: 'POST',
          headers: createHeaders(),
          body: JSON.stringify({ email, resetToken, newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to reset password');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
  },

  // Aarti Timings endpoints
  aartiTimings: {
    getAll: async (): Promise<ApiResponse<AartiTiming[]>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/aarti-timings`, {
          method: 'GET',
          headers: createHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch aarti timings');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
  },

  // Bookings endpoints
  bookings: {
    createBooking: async (bookingData: Booking): Promise<BookingResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
          method: 'POST',
          headers: createHeaders(true),
          body: JSON.stringify(bookingData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to create booking');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getMyBookings: async (type?: string, status?: string): Promise<BookingsResponse> => {
      try {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        if (status) params.append('status', status);

        const response = await fetch(`${API_BASE_URL}/bookings/my-bookings?${params.toString()}`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch bookings');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getBookingById: async (id: string): Promise<BookingResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch booking');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    updateBooking: async (id: string, bookingData: Partial<Booking>): Promise<BookingResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
          method: 'PUT',
          headers: createHeaders(true),
          body: JSON.stringify(bookingData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update booking');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    deleteBooking: async (id: string): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
          method: 'DELETE',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete booking');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
  },

  // Service Bookings endpoints
  serviceBookings: {
    createBooking: async (bookingData: ServiceBooking): Promise<ServiceBookingResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/service-bookings`, {
          method: 'POST',
          headers: createHeaders(true),
          body: JSON.stringify(bookingData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to create service booking');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getMyBookings: async (serviceType?: string, status?: string): Promise<ServiceBookingsResponse> => {
      try {
        const params = new URLSearchParams();
        if (serviceType) params.append('serviceType', serviceType);
        if (status) params.append('status', status);

        const response = await fetch(`${API_BASE_URL}/service-bookings/my-bookings?${params.toString()}`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch service bookings');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getBookingById: async (id: string): Promise<ServiceBookingResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/service-bookings/${id}`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch service booking');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    updateBooking: async (id: string, bookingData: Partial<ServiceBooking>): Promise<ServiceBookingResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/service-bookings/${id}`, {
          method: 'PUT',
          headers: createHeaders(true),
          body: JSON.stringify(bookingData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update service booking');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    deleteBooking: async (id: string): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/service-bookings/${id}`, {
          method: 'DELETE',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete service booking');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    checkMembershipBenefits: async (serviceType: string): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/service-bookings/check-benefits/${serviceType}`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to check membership benefits');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
  },

  // Payments endpoints
  payments: {
    createOrder: async (
      amount: number,
      paymentFor: string,
      userDetails: { name: string; email: string; phone: string },
      metadata?: any
    ): Promise<ApiResponse<PaymentOrder>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
          method: 'POST',
          headers: createHeaders(true),
          body: JSON.stringify({ amount, paymentFor, userDetails, metadata }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to create order');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    createPaymentLink: async (
      amount: number,
      paymentFor: string,
      userDetails: { name: string; email: string; phone: string },
      metadata?: any
    ): Promise<ApiResponse<{ paymentLinkUrl: string; paymentLinkId: string; paymentId: string }>> => {
      try {
        console.log('📡 Creating payment link:', { amount, paymentFor, userDetails });
        
        const response = await fetch(`${API_BASE_URL}/payments/create-payment-link`, {
          method: 'POST',
          headers: createHeaders(true),
          body: JSON.stringify({ amount, paymentFor, userDetails, metadata }),
        });

        const data = await response.json();
        
        console.log('📡 Payment link API response:', response.status, data);

        if (!response.ok) {
          throw new Error(data.message || 'Failed to create payment link');
        }

        return data;
      } catch (error: any) {
        console.error('❌ Payment link API error:', error);
        throw error;
      }
    },

    verifyPayment: async (paymentData: PaymentVerification): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/payments/verify`, {
          method: 'POST',
          headers: createHeaders(true),
          body: JSON.stringify(paymentData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Payment verification failed');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getMyPayments: async (): Promise<ApiResponse<any[]>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/payments/my-payments`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch payments');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
  },

  // Profile endpoints
  profile: {
    getProfile: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    updateProfile: async (profileData: any): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: 'PUT',
          headers: createHeaders(true),
          body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update profile');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile/password`, {
          method: 'PUT',
          headers: createHeaders(true),
          body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to change password');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getBookings: async (): Promise<ApiResponse<Booking[]>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile/bookings`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch bookings');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getServiceBookings: async (): Promise<ApiResponse<ServiceBooking[]>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile/service-bookings`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch service bookings');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getDonations: async (): Promise<ApiResponse<any[]>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile/donations`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch donations');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getMembership: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile/membership`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch membership');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getStats: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile/stats`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch stats');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
  },

  // Gallery endpoints
  gallery: {
    getAll: async (category?: string, search?: string): Promise<GalleryResponse> => {
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('search', search);

        const response = await fetch(`${API_BASE_URL}/gallery?${params.toString()}`, {
          method: 'GET',
          headers: createHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch gallery');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
  },

  // Projects API
  projects: {
    getAll: async (params?: { status?: string; featured?: boolean }): Promise<ApiResponse<Project[]>> => {
      try {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());

        const url = queryParams.toString() 
          ? `${API_BASE_URL}/projects?${queryParams.toString()}`
          : `${API_BASE_URL}/projects`;

        const response = await fetch(url, {
          method: 'GET',
          headers: createHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch projects');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getById: async (id: string): Promise<ApiResponse<Project>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
          method: 'GET',
          headers: createHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch project');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
  },

  // News API
  news: {
    getAll: async (params?: { category?: string; featured?: boolean }): Promise<ApiResponse<News[]>> => {
      try {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append('category', params.category);
        if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
        
        const url = `${API_BASE_URL}/news${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: createHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch news');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getById: async (id: string): Promise<ApiResponse<News>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/news/${id}`, {
          method: 'GET',
          headers: createHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch news');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
  },

  // Stories API
  stories: {
    getAll: async (params?: { category?: string; featured?: boolean }): Promise<ApiResponse<Story[]>> => {
      try {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append('category', params.category);
        if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
        
        const url = `${API_BASE_URL}/stories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: createHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch stories');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getById: async (id: string): Promise<ApiResponse<Story>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
          method: 'GET',
          headers: createHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch story');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
  },

  // Membership endpoints
  memberships: {
    getMembershipTypes: async (): Promise<ApiResponse<any[]>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/memberships/types?isActive=true`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch membership types');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getMyMemberships: async (): Promise<ApiResponse<any[]>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/memberships/my-memberships`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch memberships');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getActiveMembership: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/memberships/active`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch active membership');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    create: async (membershipData: {
      membershipType: string;
      amount: number;
      duration?: number;
      paymentId?: string;
      orderId?: string;
    }): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/memberships`, {
          method: 'POST',
          headers: createHeaders(true),
          body: JSON.stringify(membershipData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to create membership');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    cancel: async (id: string): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/memberships/${id}/cancel`, {
          method: 'PATCH',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to cancel membership');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    useBenefit: async (membershipId: string, benefitName: string, notes?: string): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/memberships/${membershipId}/use-benefit`, {
          method: 'POST',
          headers: createHeaders(true),
          body: JSON.stringify({ benefitName, notes }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to use benefit');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getRemainingBenefits: async (membershipId: string): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/memberships/${membershipId}/remaining-benefits`, {
          method: 'GET',
          headers: createHeaders(true),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to get remaining benefits');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
  },

  // Coupon endpoints
  coupons: {
    validateCoupon: async (code: string, amount: number, applicableTo: string = 'membership', membershipType?: string): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
          method: 'POST',
          headers: createHeaders(false),
          body: JSON.stringify({ code, amount, applicableTo, membershipType }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to validate coupon');
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
  },
};

export default api;

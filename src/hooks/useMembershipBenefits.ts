import { useState, useEffect } from 'react';
import { api } from '@/services/api';

export const useMembershipBenefits = (serviceType: string, isFormVisible: boolean) => {
  const [availableBenefits, setAvailableBenefits] = useState<any[]>([]);
  const [selectedBenefit, setSelectedBenefit] = useState<any>(null);
  const [useMembershipBenefit, setUseMembershipBenefit] = useState(false);
  const [isLoadingBenefits, setIsLoadingBenefits] = useState(false);

  useEffect(() => {
    const checkBenefits = async () => {
      const token = localStorage.getItem('token');
      console.log('=== FRONTEND: Checking benefits ===');
      console.log('Service Type:', serviceType);
      console.log('Is Form Visible:', isFormVisible);
      console.log('Has Token:', !!token);
      
      if (isFormVisible && token) {
        setIsLoadingBenefits(true);
        try {
          const response = await api.serviceBookings.checkMembershipBenefits(serviceType);
          console.log('API Response:', response);
          
          // Type assertion since the API returns data directly, not wrapped in ApiResponse
          const benefitsData = response as any;
          console.log('Response.success:', benefitsData.success);
          console.log('Response.canUseBenefit:', benefitsData.canUseBenefit);
          console.log('Response.availableBenefits:', benefitsData.availableBenefits);
          
          if (benefitsData.success && benefitsData.canUseBenefit) {
            console.log('✓ Setting available benefits:', benefitsData.availableBenefits);
            setAvailableBenefits(benefitsData.availableBenefits);
            setSelectedBenefit(benefitsData.availableBenefits[0]);
          } else {
            console.log('✗ No benefits available or canUseBenefit is false');
            // No benefits available, ensure regular payment is selected
            setAvailableBenefits([]);
            setSelectedBenefit(null);
            setUseMembershipBenefit(false);
          }
        } catch (error) {
          console.error('Error checking benefits:', error);
          // On error, ensure regular payment is selected
          setAvailableBenefits([]);
          setSelectedBenefit(null);
          setUseMembershipBenefit(false);
        } finally {
          setIsLoadingBenefits(false);
        }
      } else if (!token) {
        console.log('✗ No token, user not logged in');
        // User not logged in, ensure regular payment is selected
        setAvailableBenefits([]);
        setSelectedBenefit(null);
        setUseMembershipBenefit(false);
      } else {
        console.log('✗ Form not visible yet');
      }
    };
    
    checkBenefits();
  }, [isFormVisible, serviceType]);

  return {
    availableBenefits,
    selectedBenefit,
    setSelectedBenefit,
    useMembershipBenefit,
    setUseMembershipBenefit,
    isLoadingBenefits
  };
};

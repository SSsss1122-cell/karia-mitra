"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { 
  Pencil, 
  LogOut, 
  Camera, 
  Building2, 
  HardHat, 
  DraftingCompass, 
  User, 
  Eye,
  EyeOff,
  Star,
  MapPin,
  Briefcase,
  Mail,
  Phone as PhoneIcon,
  CheckCircle,
  ArrowLeft,
  Hammer,
  UserPlus,
  Key,
  Check,
  X,
  ChevronDown,
  Image as ImageIcon,
  Plus,
  Trash2
} from "lucide-react";

export default function RoleLogin() {
  const [role, setRole] = useState("Contractor");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showExpertiseDropdown, setShowExpertiseDropdown] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    location: "",
    experience: "",
    about: "",
    expertise: "",
    profileImage: null
  });
  const [workImages, setWorkImages] = useState([]);
  const [uploadingWork, setUploadingWork] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const fileInputRef = useRef(null);
  const workFileInputRef = useRef(null);
  const registerProfileInputRef = useRef(null);

  // Contractor expertise options
  const contractorExpertiseOptions = [
    "POP",
    "RCC", 
    "Electrician",
    "Plumbing",
    "Painter"
  ];

  // Role configurations with icons and colors - Updated based on actual table schemas
  const rolesConfig = {
    Contractor: {
      table: "Contractor",
      icon: <Building2 className="w-6 h-6" />,
      color: "from-blue-600 to-blue-800",
      bgColor: "from-blue-50 to-blue-100",
      fieldMapping: { 
        phone: "phone", 
        password: "password", 
        name: "name", 
        location: "location", 
        experience: "experience", 
        about: "about", 
        image: "image_url", 
        email: "email", 
        rating: "rating", 
        projects: "site_completed",
        expertise: "expertise",
        team_size: "team_size",
        works: "works"
      }
    },
    Engineer: {
      table: "Engineer", 
      icon: <HardHat className="w-6 h-6" />,
      color: "from-green-600 to-green-800",
      bgColor: "from-green-50 to-green-100",
      fieldMapping: { 
        phone: "Phone", 
        password: "Password", 
        name: "Name", 
        location: "Location", 
        experience: "Experience", 
        about: "Specialization", 
        image: "image", 
        email: "Email", 
        rating: "Rating", 
        projects: "Site_completed",
        qualification: "Qualification",
        age: "Age",
        works: "works"
      }
    },
    Architecture: {
      table: "architecture",
      icon: <DraftingCompass className="w-6 h-6" />,
      color: "from-purple-600 to-purple-800", 
      bgColor: "from-purple-50 to-purple-100",
      fieldMapping: { 
        phone: "username", 
        password: "password", 
        name: "name", 
        location: "location", 
        experience: "category", 
        about: "style_description", 
        image: "image_url", 
        email: null, 
        rating: "rating", 
        projects: null,
        category: "category",
        architect_name: "architect_name",
        project_cost: "project_cost",
        year_built: "year_built",
        works: "works"
      }
    },
    Labours: {
      table: "labours",
      icon: <User className="w-6 h-6" />,
      color: "from-orange-600 to-orange-800",
      bgColor: "from-orange-50 to-orange-100",
      fieldMapping: { 
        phone: "phone", 
        password: "password", 
        name: "name", 
        location: "location", 
        experience: "experience", 
        about: "about", 
        image: "image_url", 
        email: "email", 
        rating: "rating", 
        projects: "site_completed",
        expertise: "expertise",
        rate: "rate",
        team_size: "team_size",
        stream: "stream",
        works: "works"
      }
    },
    Builder: {
      table: "Builder",
      icon: <Hammer className="w-6 h-6" />,
      color: "from-red-600 to-red-800",
      bgColor: "from-red-50 to-red-100",
      fieldMapping: { 
        phone: "Phone", 
        password: "password", 
        name: "Name", 
        location: "Location", 
        experience: "Experience", 
        about: "About", 
        image: "Image", 
        email: "Email", 
        rating: "Rating", 
        projects: "Projects_completed",
        license: "License",
        specialties: "Specialties",
        reviews: "Reviews",
        verified: "Verified",
        works: "works"
      }
    }
  };

  // Show success animation
  const showSuccessAnimation = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Handle expertise selection
  const handleExpertiseSelect = (expertise) => {
    if (isRegister) {
      setRegisterData({ ...registerData, expertise });
    } else {
      setFormData({ ...formData, [rolesConfig[role].fieldMapping.expertise]: expertise });
    }
    setShowExpertiseDropdown(false);
  };

  // Handle profile image selection during registration
  const handleRegisterProfileImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setRegisterData({ ...registerData, profileImage: file });
  };

  // Remove profile image during registration
  const removeRegisterProfileImage = () => {
    setRegisterData({ ...registerData, profileImage: null });
    if (registerProfileInputRef.current) {
      registerProfileInputRef.current.value = '';
    }
  };

  // Check for existing session on component mount
  useEffect(() => {
    checkExistingSession();
    initializeStorageBuckets();
  }, []);

  // Load work images when user data is available
  useEffect(() => {
    if (userData) {
      loadWorkImages();
    }
  }, [userData]);

  // Check if user is already logged in
  const checkExistingSession = async () => {
    try {
      const savedUserData = localStorage.getItem('buildmaster_userData');
      const savedRole = localStorage.getItem('buildmaster_role');
      
      if (savedUserData && savedRole) {
        const userData = JSON.parse(savedUserData);
        setUserData(userData);
        setFormData(userData);
        setRole(savedRole);
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
      localStorage.removeItem('buildmaster_userData');
      localStorage.removeItem('buildmaster_role');
    }
  };

  // Utility function to check and create buckets if needed
  const initializeStorageBuckets = async () => {
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        return;
      }

      console.log('Available buckets:', buckets);
      
      const requiredBuckets = ['partner-profile', 'my-work'];
      
      for (const bucketName of requiredBuckets) {
        const bucketExists = buckets.some(bucket => bucket.name === bucketName);
        
        if (!bucketExists) {
          console.warn(`Bucket '${bucketName}' doesn't exist. Please create it in Supabase Dashboard.`);
        } else {
          console.log(`Bucket '${bucketName}' exists and is accessible`);
        }
      }
    } catch (error) {
      console.error('Error initializing storage buckets:', error);
    }
  };

  // Save session to localStorage
  const saveSession = (userData, role) => {
    localStorage.setItem('buildmaster_userData', JSON.stringify(userData));
    localStorage.setItem('buildmaster_role', role);
  };

  // Clear session from localStorage
  const clearSession = () => {
    localStorage.removeItem('buildmaster_userData');
    localStorage.removeItem('buildmaster_role');
  };

  // Handle logout
  const handleLogout = () => {
    setUserData(null);
    setFormData({});
    setEditMode(false);
    setWorkImages([]);
    clearSession();
  };

  // Load work images from database
  const loadWorkImages = async () => {
    if (!userData) return;

    try {
      const roleConfig = rolesConfig[role];
      const map = roleConfig.fieldMapping;
      
      console.log('Loading work images for user:', userData.id);
      console.log('Works field data:', userData[map.works]);
      
      // Check if works data exists in user data
      if (userData[map.works] && Array.isArray(userData[map.works])) {
        const validImages = userData[map.works].filter(url => 
          url && typeof url === 'string' && url.trim() !== '' && url.startsWith('http')
        );
        console.log('Valid work images found:', validImages);
        setWorkImages(validImages);
      } else {
        // Initialize empty works array if not exists
        console.log('No work images found, initializing empty array');
        setWorkImages([]);
      }
    } catch (error) {
      console.error('Error loading work images:', error);
      setWorkImages([]);
    }
  };

  // --- PROFILE IMAGE UPLOAD HANDLER ---
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    
    try {
      const roleConfig = rolesConfig[role];
      const map = roleConfig.fieldMapping;
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `profile_${role.toLowerCase()}_${userData.id}_${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      console.log('Uploading profile image to:', filePath);

      // Upload to partner-profile bucket
      const { error: uploadError } = await supabase.storage
        .from('partner-profile')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Profile upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('partner-profile')
        .getPublicUrl(filePath);

      console.log('Profile image uploaded successfully:', publicUrl);

      const updatedFormData = { 
        ...formData, 
        [map.image]: publicUrl 
      };
      
      setFormData(updatedFormData);

      // Update database
      const { error: updateError } = await supabase
        .from(roleConfig.table)
        .update({ [map.image]: publicUrl })
        .eq("id", userData.id);

      if (updateError) throw updateError;

      const updatedUserData = { ...userData, [map.image]: publicUrl };
      setUserData(updatedUserData);
      saveSession(updatedUserData, role);

      showSuccessAnimation("Profile picture updated successfully!");

    } catch (err) {
      console.error("Profile image upload error:", err);
      alert("Profile image upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- WORK IMAGE UPLOAD HANDLER (FIXED) ---
  const handleWorkImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingWork(true);
    
    try {
      const roleConfig = rolesConfig[role];
      const map = roleConfig.fieldMapping;

      const uploadedUrls = [];

      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`Skipping ${file.name}: Please select image files only`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`Skipping ${file.name}: Image size should be less than 5MB`);
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `work_${role.toLowerCase()}_${userData.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        // Use partner-profile bucket for work images
        const filePath = `work-images/${fileName}`;
        const bucketName = 'partner-profile';
        
        console.log(`Uploading work image to: ${bucketName}/${filePath}`);

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error for file:', file.name, uploadError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        console.log(`Work image uploaded successfully:`, publicUrl);
        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        // Get current works array from database to ensure we have the latest data
        const { data: currentUserData, error: fetchError } = await supabase
          .from(roleConfig.table)
          .select(map.works)
          .eq("id", userData.id)
          .single();

        if (fetchError) {
          console.error('Error fetching current works:', fetchError);
          throw fetchError;
        }

        const currentWorks = currentUserData[map.works] || [];
        const updatedWorks = [...currentWorks, ...uploadedUrls];
        
        console.log('Updating works array in database:', updatedWorks);

        // Update database with new works array
        const { error: updateError } = await supabase
          .from(roleConfig.table)
          .update({ [map.works]: updatedWorks })
          .eq("id", userData.id);

        if (updateError) {
          console.error('Database update error:', updateError);
          throw updateError;
        }

        // Update local state
        const updatedUserData = { 
          ...userData, 
          [map.works]: updatedWorks 
        };
        
        setUserData(updatedUserData);
        setFormData(updatedUserData);
        setWorkImages(updatedWorks);
        saveSession(updatedUserData, role);

        showSuccessAnimation(`${uploadedUrls.length} work image(s) uploaded successfully!`);
      } else {
        alert('No images were uploaded. Please check file types and sizes.');
      }

    } catch (err) {
      console.error("Work image upload error:", err);
      alert("Work image upload failed: " + (err.message || 'Unknown error.'));
    } finally {
      setUploadingWork(false);
      // Reset file input
      if (workFileInputRef.current) {
        workFileInputRef.current.value = '';
      }
    }
  };

  // --- DELETE WORK IMAGE HANDLER (FIXED) ---
  const handleDeleteWorkImage = async (imageUrl) => {
    if (!confirm('Are you sure you want to delete this work image?')) return;

    try {
      const roleConfig = rolesConfig[role];
      const map = roleConfig.fieldMapping;

      console.log('Deleting work image:', imageUrl);

      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `work-images/${fileName}`;

      console.log('File path to delete:', filePath);

      // Delete from storage - only from partner-profile bucket
      const { error: deleteError } = await supabase.storage
        .from('partner-profile')
        .remove([filePath]);

      if (deleteError) {
        console.warn('Could not delete file from storage:', deleteError);
        // Continue with database update even if file deletion fails
      }

      // Update works array in database
      const updatedWorks = workImages.filter(img => img !== imageUrl);
      
      console.log('Updating works array after deletion:', updatedWorks);

      const { error: updateError } = await supabase
        .from(roleConfig.table)
        .update({ [map.works]: updatedWorks })
        .eq("id", userData.id);

      if (updateError) throw updateError;

      // Update local state
      const updatedUserData = { 
        ...userData, 
        [map.works]: updatedWorks 
      };
      
      setUserData(updatedUserData);
      setFormData(updatedUserData);
      setWorkImages(updatedWorks);
      saveSession(updatedUserData, role);

      showSuccessAnimation("Work image deleted successfully!");

    } catch (err) {
      console.error("Work image delete error:", err);
      alert("Failed to delete work image: " + err.message);
    }
  };

  // --- REGISTER HANDLER ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadingProfile(true);

    try {
      const roleConfig = rolesConfig[role];
      const map = roleConfig.fieldMapping;
      const fullPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from(roleConfig.table)
        .select("*")
        .or(`${map.phone}.eq.${fullPhone},${map.phone}.eq.${phone}`)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingUser) {
        alert("User with this phone number already exists. Please login instead.");
        return;
      }

      let profileImageUrl = null;

      // Upload profile image if provided
      if (registerData.profileImage) {
        const file = registerData.profileImage;
        const fileExt = file.name.split('.').pop();
        const fileName = `profile_${role.toLowerCase()}_${Date.now()}.${fileExt}`;
        const filePath = `profile-pictures/${fileName}`;

        console.log('Uploading profile image during registration:', filePath);

        const { error: uploadError } = await supabase.storage
          .from('partner-profile')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('partner-profile')
          .getPublicUrl(filePath);

        profileImageUrl = publicUrl;
        console.log('Profile image uploaded during registration:', profileImageUrl);
      }

      // Prepare registration data based on role with required fields
      const registrationData = {
        [map.phone]: phone,
        [map.name]: registerData.name,
        [map.location]: registerData.location,
        [map.experience]: registerData.experience,
        [map.about]: registerData.about || "Professional in the construction industry",
        is_active: true,
        rating: 0,
        // Initialize empty works array
        [map.works]: [],
        // Add profile image if uploaded
        ...(profileImageUrl && { [map.image]: profileImageUrl }),
        // Add role-specific required fields
        ...(role === "Contractor" && { 
          expertise: registerData.expertise || "POP",
          site_completed: 0,
          team_size: 1
        }),
        ...(role === "Engineer" && { 
          Site_completed: 0,
          Qualification: "Professional",
          Specialization: registerData.expertise || "General Engineering"
        }),
        ...(role === "Architecture" && { 
          category: registerData.expertise || "Residential",
          style_description: registerData.about || "Modern architectural designs"
        }),
        ...(role === "Labours" && { 
          expertise: registerData.expertise || "General Labor",
          site_completed: 0,
          team_size: 1
        }),
        ...(role === "Builder" && { 
          Experience: registerData.experience || "General Construction",
          Projects_completed: 0,
          License: "Pending",
          Verified: false
        }),
        ...(map.email && { [map.email]: registerData.email }),
        ...(map.projects && { [map.projects]: 0 })
      };

      // Insert new user
      const { data, error } = await supabase
        .from(roleConfig.table)
        .insert([registrationData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        showSuccessAnimation("Registration successful! Your account will be activated soon.");
        setIsRegister(false);
        setRegisterData({ 
          name: "", 
          email: "", 
          location: "", 
          experience: "", 
          about: "", 
          expertise: "",
          profileImage: null 
        });
        setPhone("");
      }
    } catch (err) {
      alert("Registration failed: " + err.message);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
      setUploadingProfile(false);
    }
  };

  // --- LOGIN HANDLER ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const roleConfig = rolesConfig[role];
      const map = roleConfig.fieldMapping;
      const fullPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

      const { data, error } = await supabase
        .from(roleConfig.table)
        .select("*")
        .or(`${map.phone}.eq.${fullPhone},${map.phone}.eq.${phone}`)
        .eq(map.password, password)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Remove password from user data before storing
        const { [map.password]: _, ...userDataWithoutPassword } = data;
        setUserData(userDataWithoutPassword);
        setFormData(userDataWithoutPassword);
        saveSession(userDataWithoutPassword, role);
        showSuccessAnimation(`Welcome back, ${userDataWithoutPassword[map.name]}!`);
      } else {
        alert("Invalid phone or password.");
      }
    } catch (err) {
      alert("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATE HANDLER ---
  const handleUpdate = async () => {
    try {
      const roleConfig = rolesConfig[role];
      const map = roleConfig.fieldMapping;
      
      // Remove password field from update data if it exists
      const updateData = { ...formData };
      if (updateData[map.password]) {
        delete updateData[map.password];
      }
      
      const { error } = await supabase
        .from(roleConfig.table)
        .update(updateData)
        .eq("id", userData.id);

      if (error) throw error;

      setUserData(updateData);
      setEditMode(false);
      saveSession(updateData, role);
      showSuccessAnimation("Profile updated successfully!");
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  // Success Animation Component
  const SuccessAnimation = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
        <p className="text-gray-600 mb-6">{successMessage}</p>
        <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 animate-progress"></div>
        </div>
      </div>
    </div>
  );

  // --- DASHBOARD VIEW ---
  if (userData) {
    const roleConfig = rolesConfig[role];
    const map = roleConfig.fieldMapping;

    return (
      <div className="min-h-screen bg-gray-50">
        {showSuccess && <SuccessAnimation />}
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${roleConfig.color} p-4 sm:p-6 text-white shadow-lg`}>
          <div className="max-w-6xl mx-auto">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-white/90 hover:text-white transition mb-4 text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              <span>Back to Login</span>
            </button>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  {roleConfig.icon}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">{userData[map.name]}</h1>
                  <p className="text-white/90 text-sm sm:text-base">{role} Dashboard</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm">
                  <CheckCircle size={14} className="text-green-300" />
                  <span className="font-medium text-white">Verified Professional</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">Profile Information</h2>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition text-sm sm:text-base ${
                      editMode 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Pencil size={14} className="sm:w-4 sm:h-4" />
                    <span>{editMode ? 'Cancel' : 'Edit Profile'}</span>
                  </button>
                </div>

                {!editMode ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Email</p>
                          <p className="text-gray-800 font-medium text-sm sm:text-base">{userData[map.email] || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Phone</p>
                          <p className="text-gray-800 font-medium text-sm sm:text-base">{userData[map.phone] || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Location</p>
                          <p className="text-gray-800 font-medium text-sm sm:text-base">{userData[map.location] || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Experience</p>
                          <p className="text-gray-800 font-medium text-sm sm:text-base">{userData[map.experience] || 'Not provided'}</p>
                        </div>
                      </div>

                      {/* Role-specific additional fields */}
                      {role === "Contractor" && userData[map.expertise] && (
                        <div className="flex items-center space-x-3">
                          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600">Expertise</p>
                            <p className="text-gray-800 font-medium text-sm sm:text-base">{userData[map.expertise]}</p>
                          </div>
                        </div>
                      )}

                      {role === "Engineer" && userData[map.qualification] && (
                        <div className="flex items-center space-x-3">
                          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600">Qualification</p>
                            <p className="text-gray-800 font-medium text-sm sm:text-base">{userData[map.qualification]}</p>
                          </div>
                        </div>
                      )}

                      {role === "Builder" && userData[map.license] && (
                        <div className="flex items-center space-x-3">
                          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600">License</p>
                            <p className="text-gray-800 font-medium text-sm sm:text-base">{userData[map.license]}</p>
                          </div>
                        </div>
                      )}

                      {role === "Labours" && userData[map.rate] && (
                        <div className="flex items-center space-x-3">
                          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600">Daily Rate</p>
                            <p className="text-gray-800 font-medium text-sm sm:text-base">₹{userData[map.rate]}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {userData[map.about] && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">About</p>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{userData[map.about]}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 text-sm sm:text-base"
                          value={formData[map.name] || ""}
                          onChange={(e) => setFormData({ ...formData, [map.name]: e.target.value })}
                          placeholder="Full Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 text-sm sm:text-base"
                          value={formData[map.location] || ""}
                          onChange={(e) => setFormData({ ...formData, [map.location]: e.target.value })}
                          placeholder="Location"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Experience</label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 text-sm sm:text-base"
                          value={formData[map.experience] || ""}
                          onChange={(e) => setFormData({ ...formData, [map.experience]: e.target.value })}
                          placeholder="Experience"
                        />
                      </div>
                      {map.email && (
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 text-sm sm:text-base"
                            value={formData[map.email] || ""}
                            onChange={(e) => setFormData({ ...formData, [map.email]: e.target.value })}
                            placeholder="Email"
                          />
                        </div>
                      )}
                      {role === "Contractor" && (
                        <div className="relative">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Expertise</label>
                          <button
                            type="button"
                            onClick={() => setShowExpertiseDropdown(!showExpertiseDropdown)}
                            className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 text-left bg-white"
                          >
                            <span>{formData[map.expertise] || "Select expertise"}</span>
                            <ChevronDown size={16} className={`transition-transform ${showExpertiseDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          {showExpertiseDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                              {contractorExpertiseOptions.map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => handleExpertiseSelect(option)}
                                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-blue-50 transition text-gray-800 text-sm sm:text-base"
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {role === "Engineer" && (
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Qualification</label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 text-sm sm:text-base"
                            value={formData[map.qualification] || ""}
                            onChange={(e) => setFormData({ ...formData, [map.qualification]: e.target.value })}
                            placeholder="Qualification"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">About</label>
                      <textarea
                        className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 text-sm sm:text-base"
                        rows={3}
                        value={formData[map.about] || ""}
                        onChange={(e) => setFormData({ ...formData, [map.about]: e.target.value })}
                        placeholder="About yourself..."
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm sm:text-base"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Work Images Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mt-4 sm:mt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">My Work Portfolio</h2>
                  <button
                    onClick={() => workFileInputRef.current.click()}
                    disabled={uploadingWork}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm sm:text-base"
                  >
                    <Plus size={14} className="sm:w-4 sm:h-4" />
                    <span>{uploadingWork ? 'Uploading...' : 'Add Work Images'}</span>
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={workFileInputRef}
                    onChange={handleWorkImageUpload}
                    multiple
                    className="hidden"
                  />
                </div>

                {workImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {workImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Work ${index + 1}`}
                          className="w-full h-24 sm:h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            console.error(`Failed to load work image: ${imageUrl}`);
                            e.target.style.display = 'none';
                          }}
                        />
                        <button
                          onClick={() => handleDeleteWorkImage(imageUrl)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-600 text-sm sm:text-base">No work images uploaded yet</p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">Upload images of your completed projects</p>
                  </div>
                )}

                {uploadingWork && (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-600 text-sm mt-2">Uploading work images...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Profile Image Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
                <div className="relative inline-block">
                  <img
                    src={formData[map.image] || "/default-avatar.png"}
                    alt="Profile"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover border-4 border-white shadow-md"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    disabled={loading}
                    className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-blue-600 text-white p-1.5 sm:p-2 rounded-full hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
                  >
                    <Camera size={12} className="sm:w-4 sm:h-4" />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </div>
                
                {loading && (
                  <div className="mt-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                )}
                
                {userData[map.rating] && (
                  <div className="flex items-center justify-center space-x-1 mt-2 sm:mt-3">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">{userData[map.rating]}</span>
                    <span className="text-gray-600 text-xs sm:text-sm">rating</span>
                  </div>
                )}
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-3 sm:mb-4">Profile Stats</h3>
                <div className="space-y-2 sm:space-y-3">
                  {userData[map.projects] && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm">Projects</span>
                      <span className="font-semibold text-blue-600 text-sm sm:text-base">{userData[map.projects]}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs sm:text-sm">Work Images</span>
                    <span className="font-semibold text-blue-600 text-sm sm:text-base">{workImages.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs sm:text-sm">Status</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs sm:text-sm">Member Since</span>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">2024</span>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
                >
                  <LogOut size={16} className="sm:w-5 sm:h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGIN/REGISTER PAGE ---
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {showSuccess && <SuccessAnimation />}
      
      <div className="w-full max-w-md">
        {/* Login/Register Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-white w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">BuildMaster Pro</h1>
            <p className="text-blue-100 text-sm sm:text-base">Professional Role-Based Access</p>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Toggle between Register and Login */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-4 sm:mb-6">
              <button
                onClick={() => setIsRegister(false)}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-md font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-xs sm:text-sm ${
                  !isRegister 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Key size={14} className="sm:w-4 sm:h-4" />
                <span>Login</span>
              </button>
              <button
                onClick={() => setIsRegister(true)}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-md font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-xs sm:text-sm ${
                  isRegister 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <UserPlus size={14} className="sm:w-4 sm:h-4" />
                <span>Register</span>
              </button>
            </div>

            {/* Role Selection */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Select Your Professional Role
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {Object.entries(rolesConfig).map(([roleKey, config]) => (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => setRole(roleKey)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                      role === roleKey
                        ? `border-blue-500 bg-gradient-to-r ${config.bgColor} text-gray-800 shadow-md`
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${
                        role === roleKey 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {config.icon}
                      </div>
                      <span className="text-xs font-medium">{roleKey}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Register Form */}
            {isRegister ? (
              <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
                {/* Profile Picture Upload Section */}
                <div className="text-center">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    Profile Picture (Optional)
                  </label>
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative">
                      {registerData.profileImage ? (
                        <>
                          <img
                            src={URL.createObjectURL(registerData.profileImage)}
                            alt="Profile Preview"
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-blue-500 shadow-md"
                          />
                          <button
                            type="button"
                            onClick={removeRegisterProfileImage}
                            className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition shadow-lg"
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                          <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => registerProfileInputRef.current.click()}
                        className="flex items-center space-x-1 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition"
                      >
                        <Camera size={12} className="sm:w-4 sm:h-4" />
                        <span>{registerData.profileImage ? 'Change' : 'Upload'}</span>
                      </button>
                      {registerData.profileImage && (
                        <button
                          type="button"
                          onClick={removeRegisterProfileImage}
                          className="flex items-center space-x-1 bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-red-700 transition"
                        >
                          <Trash2 size={12} className="sm:w-4 sm:h-4" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={registerProfileInputRef}
                      onChange={handleRegisterProfileImage}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500">Max 5MB • JPG, PNG, WebP</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.trim())}
                      required
                      className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Contractor Expertise Dropdown */}
                {role === "Contractor" && (
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                      Expertise *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowExpertiseDropdown(!showExpertiseDropdown)}
                      className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 text-left bg-white"
                    >
                      <span>{registerData.expertise || "Select your expertise"}</span>
                      <ChevronDown size={16} className={`transition-transform ${showExpertiseDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showExpertiseDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {contractorExpertiseOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleExpertiseSelect(option)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-blue-50 transition text-gray-800 text-sm sm:text-base"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Other roles still use text input for expertise */}
                {role !== "Contractor" && (
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                      {role === "Engineer" ? "Specialization *" : "Expertise/Specialization *"}
                    </label>
                    <input
                      type="text"
                      placeholder={role === "Engineer" ? "e.g., Structural Engineering" : "e.g., General Construction"}
                      value={registerData.expertise}
                      onChange={(e) => setRegisterData({...registerData, expertise: e.target.value})}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your location"
                    value={registerData.location}
                    onChange={(e) => setRegisterData({...registerData, location: e.target.value})}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Experience *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 5 years in construction"
                    value={registerData.experience}
                    onChange={(e) => setRegisterData({...registerData, experience: e.target.value})}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    About Yourself
                  </label>
                  <textarea
                    placeholder="Tell us about your professional background..."
                    value={registerData.about}
                    onChange={(e) => setRegisterData({...registerData, about: e.target.value})}
                    rows={2}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs sm:text-sm">
                        {uploadingProfile ? 'Uploading Profile...' : 'Registering...'}
                      </span>
                    </div>
                  ) : (
                    `Register as ${role}`
                  )}
                </button>

                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-700 text-center">
                    📞 Your account will be activated soon. Password will be provided separately via phone.
                  </p>
                </div>
              </form>
            ) : (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.trim())}
                      required
                      className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                    >
                      {showPassword ? <EyeOff size={16} className="sm:w-5 sm:h-5" /> : <Eye size={16} className="sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs sm:text-sm">Authenticating...</span>
                    </div>
                  ) : (
                    `Sign In as ${role}`
                  )}
                </button>
              </form>
            )}

            {/* Demo Info */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs sm:text-sm text-blue-700 text-center">
                {isRegister 
                  ? "Register your professional account. Password will be set manually by admin." 
                  : "Use your registered phone number and provided password to access your dashboard."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
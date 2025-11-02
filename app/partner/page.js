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
  Hammer
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
  const fileInputRef = useRef(null);

  // Role configurations with icons and colors
  const rolesConfig = {
    Contractor: {
      table: "Contractor",
      icon: <Building2 className="w-6 h-6" />,
      color: "from-blue-600 to-blue-800",
      bgColor: "from-blue-50 to-blue-100",
      fieldMapping: { phone: "phone", password: "password", name: "name", location: "location", experience: "experience", about: "about", image: "image_url", email: "email", rating: "rating", projects: "site_completed" }
    },
    Engineer: {
      table: "Engineer", 
      icon: <HardHat className="w-6 h-6" />,
      color: "from-green-600 to-green-800",
      bgColor: "from-green-50 to-green-100",
      fieldMapping: { phone: "Phone", password: "Password", name: "Name", location: "Location", experience: "Experience", about: "Specialization", image: "image", email: "Email", rating: "Rating", projects: "Site_completed" }
    },
    Architecture: {
      table: "architecture",
      icon: <DraftingCompass className="w-6 h-6" />,
      color: "from-purple-600 to-purple-800", 
      bgColor: "from-purple-50 to-purple-100",
      fieldMapping: { phone: "username", password: "password", name: "name", location: "location", experience: "category", about: "style_description", image: "image_url", email: null, rating: "rating", projects: null }
    },
    Labours: {
      table: "labours",
      icon: <User className="w-6 h-6" />,
      color: "from-orange-600 to-orange-800",
      bgColor: "from-orange-50 to-orange-100",
      fieldMapping: { phone: "phone", password: "password", name: "name", location: "location", experience: "experience", about: "about", image: "image_url", email: "email", rating: "rating", projects: "site_completed" }
    },
    Builder: {
      table: "builder",
      icon: <Hammer className="w-6 h-6" />,
      color: "from-red-600 to-red-800",
      bgColor: "from-red-50 to-red-100",
      fieldMapping: { phone: "phone", password: "password", name: "name", location: "location", experience: "experience", about: "about", image: "image_url", email: "email", rating: "rating", projects: "projects_completed" }
    }
  };

  // Check for existing session on component mount
  useEffect(() => {
    checkExistingSession();
  }, []);

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
      // Clear invalid saved data
      localStorage.removeItem('buildmaster_userData');
      localStorage.removeItem('buildmaster_role');
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
    clearSession();
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
        setUserData(data);
        setFormData(data);
        saveSession(data, role);
      } else {
        alert("Invalid phone or password.");
      }
    } catch (err) {
      alert("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- IMAGE UPLOAD HANDLER ---
// --- IMAGE UPLOAD HANDLER ---
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setLoading(true);
  
  try {
    const roleConfig = rolesConfig[role];
    const map = roleConfig.fieldMapping;
    
    // Create unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${role.toLowerCase()}_${userData.id}_${Date.now()}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;

    // Upload image to Supabase Storage with correct bucket name
    const { error: uploadError } = await supabase.storage
      .from('partner-profile') // Your bucket name
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('partner-profile') // Same bucket name here
      .getPublicUrl(filePath);

    // Update form data with new image URL
    const updatedFormData = { 
      ...formData, 
      [map.image]: publicUrl 
    };
    
    setFormData(updatedFormData);

    // Immediately update in database
    const { error: updateError } = await supabase
      .from(roleConfig.table)
      .update({ [map.image]: publicUrl })
      .eq("id", userData.id);

    if (updateError) throw updateError;

    // Update user data and localStorage
    const updatedUserData = { ...userData, [map.image]: publicUrl };
    setUserData(updatedUserData);
    saveSession(updatedUserData, role);

    alert("Profile picture updated successfully!");

  } catch (err) {
    alert("Image upload failed: " + err.message);
    console.error("Upload error:", err);
  } finally {
    setLoading(false);
  }
};

  // --- UPDATE HANDLER ---
  const handleUpdate = async () => {
    try {
      const roleConfig = rolesConfig[role];
      const { error } = await supabase.from(roleConfig.table).update(formData).eq("id", userData.id);
      if (error) throw error;

      setUserData(formData);
      setEditMode(false);
      // Update saved session data
      saveSession(formData, role);
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  // --- DASHBOARD VIEW ---
  if (userData) {
    const roleConfig = rolesConfig[role];
    const map = roleConfig.fieldMapping;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className={`bg-gradient-to-r ${roleConfig.color} p-6 text-white shadow-lg`}>
          <div className="max-w-6xl mx-auto">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-white/90 hover:text-white transition mb-4"
            >
              <ArrowLeft size={20} />
              <span>Back to Login</span>
            </button>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  {roleConfig.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{userData[map.name]}</h1>
                  <p className="text-white/90">{role} Dashboard</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <CheckCircle size={16} className="text-green-300" />
                  <span className="font-medium text-white">Verified Professional</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                      editMode 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Pencil size={16} />
                    <span>{editMode ? 'Cancel' : 'Edit Profile'}</span>
                  </button>
                </div>

                {!editMode ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="text-gray-800 font-medium">{userData[map.email] || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="text-gray-800 font-medium">{userData[map.phone] || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="text-gray-800 font-medium">{userData[map.location] || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Briefcase className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Experience</p>
                          <p className="text-gray-800 font-medium">{userData[map.experience] || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    {userData[map.about] && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">About</p>
                        <p className="text-gray-700 leading-relaxed">{userData[map.about]}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800"
                          value={formData[map.name] || ""}
                          onChange={(e) => setFormData({ ...formData, [map.name]: e.target.value })}
                          placeholder="Full Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800"
                          value={formData[map.location] || ""}
                          onChange={(e) => setFormData({ ...formData, [map.location]: e.target.value })}
                          placeholder="Location"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800"
                          value={formData[map.experience] || ""}
                          onChange={(e) => setFormData({ ...formData, [map.experience]: e.target.value })}
                          placeholder="Experience"
                        />
                      </div>
                      {map.email && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800"
                            value={formData[map.email] || ""}
                            onChange={(e) => setFormData({ ...formData, [map.email]: e.target.value })}
                            placeholder="Email"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                      <textarea
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800"
                        rows={4}
                        value={formData[map.about] || ""}
                        onChange={(e) => setFormData({ ...formData, [map.about]: e.target.value })}
                        placeholder="About yourself..."
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Image Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <div className="relative inline-block">
                  <img
                    src={formData[map.image] || "/default-avatar.png"}
                    alt="Profile"
                    className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-md"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-lg"
                  >
                    <Camera size={16} />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                
                {userData[map.rating] && (
                  <div className="flex items-center justify-center space-x-1 mt-3">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-800">{userData[map.rating]}</span>
                    <span className="text-gray-600 text-sm">rating</span>
                  </div>
                )}
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Profile Stats</h3>
                <div className="space-y-3">
                  {userData[map.projects] && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Projects</span>
                      <span className="font-semibold text-blue-600">{userData[map.projects]}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-semibold text-gray-800">2024</span>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGIN PAGE ---
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">BuildMaster Pro</h1>
            <p className="text-blue-100">Professional Role-Based Access</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Your Professional Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(rolesConfig).map(([roleKey, config]) => (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => setRole(roleKey)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      role === roleKey
                        ? `border-blue-500 bg-gradient-to-r ${config.bgColor} text-gray-800 shadow-md`
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`p-2 rounded-lg ${
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

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.trim())}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  `Sign In as ${role}`
                )}
              </button>
            </form>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 text-center">
                Use your registered phone number and password to access your professional dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
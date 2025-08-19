import React, { useState } from 'react';

// --- Helper Components ---

// Icon component for easily rendering SVG icons
const Icon = ({ path, className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

// --- SVG Icons ---
const ICONS = {
  check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
  user: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  document: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  upload: "M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z",
  arrowRight: "M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z",
  car: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"
};


// --- Main App Component ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [formData, setFormData] = useState({});

  const handleStart = () => {
    setCurrentPage('application');
  };

  const handleSubmit = (data) => {
    setFormData(data);
    setCurrentPage('review');
  };
  
  const handleConfirm = () => {
    // Here you would typically send the data to a server
    console.log("Application Submitted:", formData);
    setCurrentPage('confirmation');
  };
  
  const handleEdit = () => {
      setCurrentPage('application');
  }

  const handleResubmit = () => {
      setFormData({});
      setCurrentPage('home');
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onStart={handleStart} />;
      case 'application':
        return <ApplicationPage onSubmit={handleSubmit} initialData={formData} />;
      case 'review':
        return <ReviewPage formData={formData} onConfirm={handleConfirm} onEdit={handleEdit} />;
      case 'confirmation':
        return <ConfirmationPage onResubmit={handleResubmit} />;
      default:
        return <HomePage onStart={handleStart} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Department of Motor Traffic</h1>
            <p className="text-sm text-gray-600">Online Driving Licence Application</p>
          </div>
          <nav className="space-x-4 text-sm font-medium">
            <a href="#" className="text-gray-500 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-500 hover:text-gray-900">Check Status</a>
            <a href="#" className="text-gray-500 hover:text-gray-900">Contact Us</a>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderPage()}
      </main>
    </div>
  );
}

// --- Page Components ---

const HomePage = ({ onStart }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Apply for a New Driving Licence Online</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Welcome to the official portal for Sri Lankan driving licence applications. This secure system allows you to apply for a new licence from the comfort of your home.</p>
      <div className="flex justify-center">
        <button onClick={onStart} className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Start New Application
          <Icon path={ICONS.arrowRight} className="w-5 h-5 ml-2 -mr-1" />
        </button>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">1. Fill the Application</h3>
          <p className="text-sm text-gray-600">Complete the multi-step form with your personal details, contact information, and desired licence categories.</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">2. Upload Documents</h3>
          <p className="text-sm text-gray-600">Scan and upload clear copies of your medical certificate, National ID card, and a recent photograph.</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">3. Review & Submit</h3>
          <p className="text-sm text-gray-600">Carefully review all your entered information before submitting your application for processing.</p>
        </div>
      </div>
    </div>
  );
};

const ApplicationPage = ({ onSubmit, initialData }) => {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState(initialData || {});

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  
  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormState(prev => ({...prev, [name]: value}));
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalDetailsStep data={formState} onChange={handleChange} />;
      case 2:
        return <LicenceDetailsStep data={formState} onChange={handleChange} />;
      case 3:
        return <ContactInfoStep data={formState} onChange={handleChange} />;
      case 4:
        return <DocumentUploadStep data={formState} onChange={handleChange} />;
      default:
        return null;
    }
  };
  
  const totalSteps = 4;
  const isLastStep = step === totalSteps;

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">New Driving Licence Application Form</h2>
        <p className="text-gray-600 mb-6">Step {step} of {totalSteps} - {['Personal Details', 'Licence Details', 'Contact Information', 'Document Upload'][step-1]}</p>
        
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(step/totalSteps)*100}%` }}></div>
          </div>
        </div>

        <div>{renderStep()}</div>

        <div className="mt-8 pt-6 border-t flex justify-between">
            <button onClick={handleBack} disabled={step === 1} className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Back</button>
            {isLastStep ? (
                <button onClick={() => onSubmit(formState)} className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">Review Application</button>
            ) : (
                <button onClick={handleNext} className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">Next Step</button>
            )}
        </div>
    </div>
  );
};

const ReviewPage = ({ formData, onConfirm, onEdit }) => {
    const selectedCategories = Object.keys(formData).filter(key => ['A1', 'A', 'B1', 'B', 'C1', 'C'].includes(key) && formData[key]).join(', ');

    return (
        <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Application</h2>
            <p className="text-gray-600 mb-6">Please carefully check all your details before final submission.</p>

            <div className="space-y-6">
                {/* Personal Details */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><strong className="text-gray-600">Full Name:</strong> {formData.fullName}</p>
                        <p><strong className="text-gray-600">NIC:</strong> {formData.nic}</p>
                        <p><strong className="text-gray-600">Date of Birth:</strong> {formData.dob}</p>
                        <p><strong className="text-gray-600">Blood Group:</strong> {formData.bloodGroup}</p>
                    </div>
                </div>
                 {/* Licence Details */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Licence Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><strong className="text-gray-600">Licence Categories:</strong> {selectedCategories}</p>
                    </div>
                </div>
                {/* Contact Information */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><strong className="text-gray-600">Address:</strong> {formData.address}</p>
                        <p><strong className="text-gray-600">Phone:</strong> {formData.phone}</p>
                        <p className="col-span-2"><strong className="text-gray-600">Email:</strong> {formData.email}</p>
                    </div>
                </div>
                {/* Documents */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Uploaded Documents</h3>
                    <ul className="text-sm space-y-1">
                        <li className="flex items-center text-green-600"><Icon path={ICONS.check} className="w-4 h-4 mr-2"/>Medical Certificate: medical.pdf</li>
                        <li className="flex items-center text-green-600"><Icon path={ICONS.check} className="w-4 h-4 mr-2"/>National ID Card: nic_scans.zip</li>
                        <li className="flex items-center text-green-600"><Icon path={ICONS.check} className="w-4 h-4 mr-2"/>Photograph: photo.jpg</li>
                    </ul>
                </div>
            </div>
            
            <div className="mt-8 pt-6 border-t flex justify-end space-x-3">
                <button onClick={onEdit} className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Edit Details</button>
                <button onClick={onConfirm} className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">Confirm & Submit</button>
            </div>
        </div>
    );
};

const ConfirmationPage = ({ onResubmit }) => {
    return (
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon path={ICONS.check} className="w-8 h-8 text-green-600"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
            <p className="text-gray-600 mb-4">Your application has been received. You will be notified for the written and practical tests.</p>
            <div className="bg-gray-100 p-4 rounded-md inline-block">
                <p className="text-sm text-gray-600">Your Application Reference Number is:</p>
                <p className="text-lg font-bold text-indigo-600">SLDL-2024-117892</p>
            </div>
            <p className="text-sm text-gray-500 mt-6">You will receive an email confirmation shortly. You can use the reference number to check the status of your application online.</p>
            <div className="mt-8">
                <button 
                    onClick={onResubmit} 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Submit Another Application
                </button>
            </div>
        </div>
    );
};

// --- Form Step Components ---

const FormInput = ({ label, name, value, onChange, placeholder, type="text" }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input type={type} name={name} id={name} value={value || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={placeholder} />
    </div>
);

const FormSelect = ({ label, name, value, onChange, children }) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <select id={name} name={name} value={value || ''} onChange={onChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            {children}
        </select>
    </div>
)

const PersonalDetailsStep = ({ data, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput label="Full Name as per NIC" name="fullName" value={data.fullName} onChange={onChange} placeholder="e.g., Kasun Asanka Silva" />
        <FormInput label="National Identity Card (NIC) Number" name="nic" value={data.nic} onChange={onChange} placeholder="e.g., 199925801234" />
        <FormInput label="Date of Birth" name="dob" value={data.dob} onChange={onChange} type="date" />
        <FormSelect label="Blood Group" name="bloodGroup" value={data.bloodGroup} onChange={onChange}>
            <option>Select Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
        </FormSelect>
    </div>
);

const LicenceDetailsStep = ({ data, onChange }) => (
    <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Licence Category</h3>
        <p className="text-sm text-gray-500 mb-4">Select the class of vehicles you wish to apply for. You may select multiple categories.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <CheckboxCard id="A1" label="A1" description="Light Motor Cycle" data={data} onChange={onChange} />
            <CheckboxCard id="A" label="A" description="Motor Cycle" data={data} onChange={onChange} />
            <CheckboxCard id="B1" label="B1" description="Motor Tricycle" data={data} onChange={onChange} />
            <CheckboxCard id="B" label="B" description="Light Motor Car" data={data} onChange={onChange} />
            <CheckboxCard id="C1" label="C1" description="Light Motor Lorry" data={data} onChange={onChange} />
            <CheckboxCard id="C" label="C" description="Heavy Motor Lorry" data={data} onChange={onChange} />
        </div>
    </div>
);

const CheckboxCard = ({ id, label, description, data, onChange }) => (
    <label htmlFor={id} className={`relative flex flex-col p-4 border rounded-lg cursor-pointer ${data[id] ? 'border-indigo-600 ring-2 ring-indigo-600' : 'border-gray-300'}`}>
        <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-600">{label}</span>
            <input id={id} name={id} type="checkbox" checked={data[id] || false} onChange={e => onChange({ target: { name: id, value: e.target.checked }})} className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        </div>
        <div className="mt-2 text-sm text-gray-600">{description}</div>
    </label>
);


const ContactInfoStep = ({ data, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
            <FormInput label="Permanent Address" name="address" value={data.address} onChange={onChange} placeholder="e.g., No. 123, Galle Road, Colombo 03" />
        </div>
        <FormInput label="Mobile Number" name="phone" value={data.phone} onChange={onChange} placeholder="e.g., 0771234567" />
        <FormInput label="Email Address" name="email" value={data.email} onChange={onChange} placeholder="e.g., yourname@example.com" />
    </div>
);

const DocumentUploadStep = () => (
    <div className="space-y-6">
        <FileUploadBox title="Medical Certificate" description="Upload a scanned copy of the medical certificate from a registered practitioner."/>
        <FileUploadBox title="National ID Card (NIC)" description="Upload scanned copies of both front and back sides."/>
        <FileUploadBox title="Passport Sized Photograph" description="Upload a recent, high-quality photograph with a white background."/>
    </div>
);

const FileUploadBox = ({ title, description }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Icon path={ICONS.upload} className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
        <div className="mt-4">
            <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Select Files
            </button>
        </div>
    </div>
);

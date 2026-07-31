import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, type Project } from '@/services/project.service';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const response = await projectService.getById(id);
        const data = response.data || response;
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project details', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
        <p className="text-gray-500 mb-6">The project you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/projects')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white pb-20">
      {/* Hero Image */}
      <div className="w-full h-[50vh] md:h-[60vh] bg-gray-900 relative">
        {project.images && project.images.length > 0 ? (
          <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">No Image Available</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{project.status}</span>
            {project.category && <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{project.category}</span>}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{project.title}</h1>
          {project.subtitle && <p className="text-xl md:text-2xl text-gray-300 font-light">{project.subtitle}</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Project</h2>
              <div className="prose prose-blue max-w-none text-gray-600">
                <p className="whitespace-pre-wrap leading-relaxed">{project.description}</p>
              </div>
            </section>

            {/* Key Information Grid */}
            <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Key Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {project.location && (
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Location</span>
                    <span className="font-semibold text-gray-900">{project.location}</span>
                  </div>
                )}
                {project.emirate && (
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Emirate</span>
                    <span className="font-semibold text-gray-900">{project.emirate}</span>
                  </div>
                )}
                {project.duration && (
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Duration</span>
                    <span className="font-semibold text-gray-900">{project.duration}</span>
                  </div>
                )}
                {project.bestTime && (
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Best Time</span>
                    <span className="font-semibold text-gray-900">{project.bestTime}</span>
                  </div>
                )}
                {project.bestSeason && (
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Best Season</span>
                    <span className="font-semibold text-gray-900">{project.bestSeason}</span>
                  </div>
                )}
                {project.distanceFromCity && (
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Distance from City</span>
                    <span className="font-semibold text-gray-900">{project.distanceFromCity}</span>
                  </div>
                )}
                {project.whatsappNumber && (
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">WhatsApp</span>
                    <span className="font-semibold text-gray-900">{project.whatsappNumber}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-blue-50 p-2 rounded-lg">
                        {highlight.icon ? (
                          <img src={highlight.icon} alt="icon" className="w-full h-full object-contain" />
                        ) : (
                          <span className="font-mono text-xl">✨</span>
                        )}
                      </div>
                      <span className="text-gray-700 font-medium pt-1">{highlight.text}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Ideal For */}
            {project.idealFor && project.idealFor.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ideal For</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.idealFor.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-3 bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                      <div className="w-16 h-16 flex items-center justify-center bg-purple-50 p-3 rounded-full">
                        {item.icon ? (
                          <img src={item.icon} alt="icon" className="w-full h-full object-contain" />
                        ) : (
                          <span className="font-mono text-2xl">🎯</span>
                        )}
                      </div>
                      <span className="text-gray-900 font-semibold">{item.text}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience Steps */}
            {project.experienceSteps && project.experienceSteps.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience Itinerary</h2>
                <div className="space-y-6">
                  {project.experienceSteps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shadow">
                          {index + 1}
                        </div>
                        {index !== project.experienceSteps!.length - 1 && (
                          <div className="w-0.5 h-full bg-blue-100 my-2"></div>
                        )}
                      </div>
                      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex-1 mb-2">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
                        <p className="text-gray-600">{step.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Practical Information */}
            {(project.safetyAndComfort?.length || project.accessibility?.length || project.dressCode || project.nearbyLandmarks?.length) ? (
              <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Practical Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Safety & Comfort */}
                  {project.safetyAndComfort && project.safetyAndComfort.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-blue-600">🛡️</span> Safety & Comfort
                      </h3>
                      <ul className="space-y-4">
                        {project.safetyAndComfort.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-white rounded shadow-sm border border-gray-100 p-1">
                              {item.icon ? <img src={item.icon} alt="icon" className="w-full h-full object-contain" /> : '🛡️'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                              {item.description && <p className="text-gray-500 text-sm">{item.description}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Accessibility */}
                  {project.accessibility && project.accessibility.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-blue-600">♿</span> Accessibility
                      </h3>
                      <ul className="space-y-4">
                        {project.accessibility.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-white rounded shadow-sm border border-gray-100 p-1">
                              {item.icon ? <img src={item.icon} alt="icon" className="w-full h-full object-contain" /> : '♿'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                              {item.description && <p className="text-gray-500 text-sm">{item.description}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dress Code & Landmarks */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 pt-8 border-t border-gray-200">
                    {project.dressCode && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-blue-600">👕</span> Dress Code
                        </h3>
                        <div className="space-y-3">
                          {project.dressCode.recommended && (
                            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                              <span className="text-xs font-bold text-green-800 uppercase tracking-wider block mb-1">Recommended</span>
                              <p className="text-green-900 text-sm">{project.dressCode.recommended}</p>
                            </div>
                          )}
                          {project.dressCode.avoid && (
                            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                              <span className="text-xs font-bold text-red-800 uppercase tracking-wider block mb-1">Avoid</span>
                              <p className="text-red-900 text-sm">{project.dressCode.avoid}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {project.nearbyLandmarks && project.nearbyLandmarks.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-blue-600">📍</span> Nearby Landmarks
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {project.nearbyLandmarks.map((landmark, index) => (
                            <span key={index} className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm shadow-sm">
                              {landmark}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ) : null}

            {/* Gallery */}
            {project.images && project.images.length > 1 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.images.slice(1).map((img, index) => (
                    <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
                    </div>
                  ))}
                </div>
              </section>
            )}
            
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Interested in this property?</h3>
              <p className="text-gray-500 mb-6 text-sm">Contact our expert agents today to schedule a viewing or request more information.</p>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors mb-3 shadow-md shadow-blue-600/20">
                Register Interest
              </button>
              <button className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 py-3 px-4 rounded-xl font-medium transition-colors mb-6">
                Download Brochure
              </button>

              <hr className="border-gray-100 mb-6" />

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                  <img src="https://ui-avatars.com/api/?name=Agent+Property&background=e0f2fe&color=0284c7" alt="Agent" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Listed By</p>
                  <p className="text-gray-900 font-bold">PropertySeller Team</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;

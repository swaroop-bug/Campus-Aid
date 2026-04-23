// import { useEffect, useState } from 'react';
// import api from '../services/api';

// export default function LostFound() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     type: 'lost',
//     category: '',
//     location: '',
//     contactEmail: '',
//     contactPhone: ''
//   });

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const fetchPosts = async () => {
//     setLoading(true);
//     const data = await api.lostfound.getPosts();
//     setPosts(data);
//     setLoading(false);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = new FormData();
//     Object.keys(formData).forEach(key => {
//       form.append(key, formData[key]);
//     });
    
//     await api.lostfound.create(form);
//     setFormData({
//       title: '',
//       description: '',
//       type: 'lost',
//       category: '',
//       location: '',
//       contactEmail: '',
//       contactPhone: ''
//     });
//     fetchPosts();
//   };

//   if (loading) return <div className="loading">Loading Lost & Found...</div>;

//   return (
//     <div className="main-container">
//       <h1 style={{color: 'white', marginBottom: '2rem'}}>🔍 Lost & Found</h1>

//       {/* Form Section */}
//       <div style={{
//         background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
//         padding: '2rem',
//         borderRadius: '12px',
//         marginBottom: '2rem'
//       }}>
//         <h2 style={{color: 'white', marginBottom: '1.5rem'}}>Report an Item</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Type</label>
//             <div className="radio-group">
//               <label>
//                 <input
//                   type="radio"
//                   name="type"
//                   value="lost"
//                   checked={formData.type === 'lost'}
//                   onChange={handleChange}
//                 />
//                 Lost
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   name="type"
//                   value="found"
//                   checked={formData.type === 'found'}
//                   onChange={handleChange}
//                 />
//                 Found
//               </label>
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Item Name</label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               placeholder="e.g., Black Wallet"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Describe the item in detail..."
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Location</label>
//             <input
//               type="text"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               placeholder="Where was it lost/found?"
//             />
//           </div>

//           <div className="form-group">
//             <label>Contact Email</label>
//             <input
//               type="email"
//               name="contactEmail"
//               value={formData.contactEmail}
//               onChange={handleChange}
//               placeholder="your.email@example.com"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Contact Phone</label>
//             <input
//               type="tel"
//               name="contactPhone"
//               value={formData.contactPhone}
//               onChange={handleChange}
//               placeholder="Your phone number"
//               required
//             />
//           </div>

//           <button type="submit" className="submit-btn" style={{width: '100%'}}>
//             Submit Report
//           </button>
//         </form>
//       </div>

//       {/* Table Section */}
//       <div style={{
//         background: 'white',
//         borderRadius: '12px',
//         overflow: 'hidden',
//         boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
//       }}>
//         <h2 style={{
//           color: '#333',
//           padding: '1.5rem',
//           margin: 0,
//           borderBottom: '2px solid #e0e0e0'
//         }}>Reported Items</h2>
        
//         {posts.length === 0 ? (
//           <div style={{padding: '2rem', textAlign: 'center', color: '#666'}}>
//             No items reported yet
//           </div>
//         ) : (
//           <table style={{
//             width: '100%',
//             borderCollapse: 'collapse'
//           }}>
//             <thead>
//               <tr style={{background: '#f5f5f5'}}>
//                 <th style={{padding: '1rem', textAlign: 'left', color: '#333', fontWeight: 'bold'}}>Type</th>
//                 <th style={{padding: '1rem', textAlign: 'left', color: '#333', fontWeight: 'bold'}}>Item Name</th>
//                 <th style={{padding: '1rem', textAlign: 'left', color: '#333', fontWeight: 'bold'}}>Description</th>
//                 <th style={{padding: '1rem', textAlign: 'left', color: '#333', fontWeight: 'bold'}}>Location</th>
//                 <th style={{padding: '1rem', textAlign: 'left', color: '#333', fontWeight: 'bold'}}>Contact Email</th>
//                 <th style={{padding: '1rem', textAlign: 'left', color: '#333', fontWeight: 'bold'}}>Contact Phone</th>
//               </tr>
//             </thead>
//             <tbody>
//               {posts.map((item, index) => (
//                 <tr key={item._id} style={{
//                   borderBottom: '1px solid #e0e0e0',
//                   background: index % 2 === 0 ? 'white' : '#fafafa'
//                 }}>
//                   <td style={{padding: '1rem'}}>
//                     <span style={{
//                       background: item.type === 'lost' ? '#e74c3c' : '#27ae60',
//                       color: 'white',
//                       padding: '0.3rem 0.8rem',
//                       borderRadius: '20px',
//                       fontSize: '0.85rem',
//                       fontWeight: 'bold',
//                       textTransform: 'uppercase'
//                     }}>
//                       {item.type}
//                     </span>
//                   </td>
//                   <td style={{padding: '1rem', color: '#333', fontWeight: '500'}}>{item.title}</td>
//                   <td style={{padding: '1rem', color: '#666'}}>{item.description}</td>
//                   <td style={{padding: '1rem', color: '#666'}}>{item.location || 'N/A'}</td>
//                   <td style={{padding: '1rem', color: '#667eea'}}>{item.contactEmail}</td>
//                   <td style={{padding: '1rem', color: '#666'}}>{item.contactPhone}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import api from '../services/api';

export default function LostFound() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'lost', // only lost items can be reported now
    category: '',
    location: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('token') ? parseJwt(localStorage.getItem('token')).id : null);

  // Decode JWT to get user ID
  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const data = await api.lostfound.getPosts();
    setPosts(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach(key => {
      form.append(key, formData[key]);
    });
    
    await api.lostfound.create(form);
    setFormData({
      title: '',
      description: '',
      type: 'lost',
      category: '',
      location: '',
      contactEmail: '',
      contactPhone: ''
    });
    fetchPosts();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.lostfound.delete(id);
        fetchPosts();
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  const handleForget = async (id) => {
    if (window.confirm('Are you sure you want to forget this found item?')) {
      try {
        await api.lostfound.forget(id);
        fetchPosts();
      } catch (err) {
        alert('Failed to forget post');
      }
    }
  };

  if (loading) return <div className="loading">Loading Lost & Found...</div>;

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f35 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{
          color: 'white',
          marginBottom: '2rem',
          fontSize: '2.5rem',
          textAlign: 'center'
        }}>
          🔍 Lost & Found
        </h1>

        {/* Form Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '2rem',
          borderRadius: '15px',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            color: '#333',
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            borderBottom: '2px solid #667eea',
            paddingBottom: '0.5rem'
          }}>
            Report an Item
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Type Selection */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Type *
                </label>
                <div style={{
                  display: 'flex',
                  gap: '2rem',
                  padding: '0.5rem 0'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    color: '#333',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}>
                    <input
                      type="radio"
                      name="type"
                      value="lost"
                      checked={formData.type === 'lost'}
                      onChange={handleChange}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: '#e74c3c'
                      }}
                    />
                    <span style={{ color: '#e74c3c' }}>❌ Lost</span>
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    color: '#333',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}>
                    <input
                      type="radio"
                      name="type"
                      value="found"
                      checked={formData.type === 'found'}
                      onChange={handleChange}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: '#27ae60'
                      }}
                    />
                    <span style={{ color: '#27ae60' }}>✅ Found</span>
                  </label>
                </div>
              </div>

              {/* Item Name */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Item Name *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Black Wallet"
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border 0.3s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              {/* Category */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Electronics, Clothing"
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border 0.3s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              {/* Location */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Where was it lost/found?"
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border 0.3s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border 0.3s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              {/* Description */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the item in detail..."
                  required
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'border 0.3s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              {/* Contact Email */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border 0.3s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '1.5rem',
                width: '100%',
                padding: '0.9rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Submit Report
            </button>
          </form>
        </div>

        {/* Table Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1.5rem',
            color: 'white'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>📋 Reported Items</h2>
          </div>

          {posts.length === 0 ? (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              color: '#666'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>No items reported yet</h3>
              <p>Be the first to report a lost or found item!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      color: '#333',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Type</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      color: '#333',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Item</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      color: '#333',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Description</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      color: '#333',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Location</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      color: '#333',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Contact</th>
                    {/* <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      color: '#333',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {posts.map((item, index) => (
                    <tr
                      key={item._id}
                      style={{
                        borderBottom: '1px solid #e0e0e0',
                        background: index % 2 === 0 ? 'white' : '#fafafa',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                      onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fafafa'}
                    >
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          background: item.type === 'lost' ? '#fee' : '#efe',
                          color: item.type === 'lost' ? '#e74c3c' : '#27ae60',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          display: 'inline-block'
                        }}>
                          {item.type === 'lost' ? '❌ Lost' : '✅ Found'}
                        </span>
                      </td>
                      <td style={{
                        padding: '1rem',
                        color: '#333',
                        fontWeight: '600',
                        fontSize: '0.95rem'
                      }}>
                        {item.title}
                      </td>
                      <td style={{
                        padding: '1rem',
                        color: '#666',
                        fontSize: '0.9rem',
                        maxWidth: '250px'
                      }}>
                        {item.description}
                      </td>
                      <td style={{
                        padding: '1rem',
                        color: '#666',
                        fontSize: '0.9rem'
                      }}>
                        📍 {item.location || 'N/A'}
                      </td>
                      <td style={{
                        padding: '1rem',
                        fontSize: '0.9rem'
                      }}>
                        <div style={{ color: '#667eea', marginBottom: '0.3rem' }}>
                          📧 {item.contactEmail}
                        </div>
                        <div style={{ color: '#666' }}>
                          📱 {item.contactPhone}
                        </div>
                      </td>
                      <td style={{
                        padding: '1rem',
                        textAlign: 'center'
                      }}>
                        {item.postedBy?._id === currentUserId && (
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            {item.type === 'found' && (
                              <button
                                onClick={() => handleForget(item._id)}
                                style={{
                                  background: '#f39c12',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.5rem 1rem',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  transition: 'all 0.2s',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#e67e22';
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#f39c12';
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                              >
                                🧠 Forget
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(item._id)}
                              style={{
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                transition: 'all 0.2s',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#c0392b';
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#e74c3c';
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
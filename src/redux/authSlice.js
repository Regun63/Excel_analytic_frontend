import {createSlice} from"@reduxjs/toolkit"

const authSlice=createSlice({
    name:"auth",
    initialState:{users:null,
        userProfile:null,
        selectedUser:null,
        uploads:[],
        allusers: [],
        
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.users=action.payload;
          
        },
        setUsers: (state, action) => {
            state.allusers = action.payload; 
            },
        setUploads:(state,action)=>{
             state.uploads = action.payload;
        },
        addChart: (state, action) => {
            const { uploadId, charts } = action.payload;
            const upload = state.uploads.find(u => u._id === uploadId);
            if (upload) {
                upload.charts = charts; 
            }
            },
       updateChart: (state, action) => {
        const { uploadId, charts } = action.payload;
        const upload = state.uploads.find(u => u._id === uploadId);
        if (upload) {
            upload.charts = charts;
        }
        },

       logout: (state) => {
      state.users = null;
      state.userProfile = null;
      state.allusers=null;
      
       
    },

    }
})

export const authActions=authSlice.actions;
export default authSlice.reducer;
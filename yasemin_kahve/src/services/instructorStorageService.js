import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../firebase'

export const uploadInstructorAvatar = async (instructorId, avatarFile, instructorName = '', oldAvatarUrl = null) => {
  try {
    // Delete old avatar if it exists
    if (oldAvatarUrl) {
      await deleteInstructorAvatar(oldAvatarUrl)
    }
    
    // Generate meaningful filename
    const sanitizedName = instructorName 
      ? instructorName.toLowerCase().replace(/[^a-z0-9]/g, '_')
      : instructorId
    const fileExtension = avatarFile.name.split('.').pop()
    const fileName = `${sanitizedName}_avatar.${fileExtension}`
    
    const avatarRef = ref(storage, `instructors/${instructorId}/${fileName}`)
    const snapshot = await uploadBytes(avatarRef, avatarFile)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading instructor avatar:', error)
    throw error
  }
}

export const deleteInstructorAvatar = async (avatarUrl) => {
  try {
    if (!avatarUrl || !avatarUrl.includes('firebase')) return
    const fileRef = ref(storage, avatarUrl)
    await deleteObject(fileRef)
    console.log('Instructor avatar deleted successfully:', avatarUrl)
  } catch (error) {
    console.error('Error deleting instructor avatar:', error)
    throw error
  }
}

export const deleteAllInstructorFiles = async (instructorId, instructorData) => {
  try {
    // Delete instructor avatar
    if (instructorData.avatar && instructorData.avatar.includes('firebase')) {
      await deleteInstructorAvatar(instructorData.avatar)
    }
    
    console.log(`All files for instructor ${instructorId} have been deleted`)
  } catch (error) {
    console.error('Error deleting instructor files:', error)
    throw error
  }
}
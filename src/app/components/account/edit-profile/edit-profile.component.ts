import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditProfileComponent {

  profileForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  base64Image: string | null = null;
  isUploading = false;
  maxFileSize = 1048576; // 1MB in bytes
  fileSizeError = false;

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    private authService: AuthService,
    private ref: DynamicDialogRef,
    private messageService: MessageService) {}

  ngOnInit() {
    const user = this.config.data?.user || {};
    
    this.profileForm = this.fb.group({
      firstName: [user.firstName || '', Validators.required],
      lastName: [user.lastName || '', Validators.required],
      email: [user.email || '', [Validators.required, Validators.email]],
      preferredMarket: [user.preferredMarket || '', Validators.required]
    });

    // Set preview URL if user has existing profile picture
    if (user.profile_photo) {
      this.previewUrl = user.profile_photo;
      this.base64Image = user.profile_photo;
    } else if (user.profilePicture) {
      // Fallback for old profilePicture field
      this.previewUrl = user.profilePicture;
      this.base64Image = user.profilePicture;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (1MB limit)
    if (file.size > this.maxFileSize) {
      this.fileSizeError = true;
      this.selectedFile = null;
      this.previewUrl = null;
      this.messageService.add({ 
        severity: 'error', 
        summary: 'File Too Large', 
        detail: 'Profile picture must be less than 1MB' 
      });
      return;
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Invalid File', 
        detail: 'Please select an image file' 
      });
      return;
    }

    this.fileSizeError = false;
    this.selectedFile = file;

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.base64Image = e.target.result;
      this.previewUrl = e.target.result;
    };
    reader.onerror = (error) => {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'File Read Error', 
        detail: 'Failed to read the image file. Please try again.' 
      });
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.selectedFile = null;
    const user = this.config.data?.user;
    this.previewUrl = user?.profile_photo || user?.profilePicture || null;
    this.base64Image = user?.profile_photo || user?.profilePicture || null;
  }

  submit() {
    if (this.profileForm.invalid) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Validation Error', 
        detail: 'Please fill all required fields correctly' 
      });
      return;
    }

    this.isUploading = true;
    const userId = localStorage.getItem('userId');
    const currentUser = this.config.data?.user;
    const formValue = this.profileForm.value;

    // Update profile with base64 image if available
    const profilePhoto = this.base64Image || currentUser?.profile_photo || currentUser?.profilePicture || null;
    this.updateProfile(userId, formValue, profilePhoto);
  }

  private updateProfile(userId: string, formValue: any, profilePhotoBase64?: string) {
    const updateData: any = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      preferredMarket: formValue.preferredMarket
    };

    // Add profile photo as base64 if provided
    if (profilePhotoBase64) {
      updateData.profile_photo = profilePhotoBase64;
    }

    // Update Firestore
    this.authService.updateUserProfile(userId, updateData).then(() => {
      // Update email in Firebase Auth if it changed
      if (formValue.email !== this.config.data?.user?.email) {
        this.authService.updateEmail(formValue.email).then(() => {
          // Also update email in Firestore
          this.authService.updateUserProfile(userId, { email: formValue.email }).then(() => {
            this.isUploading = false;
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Profile Updated', 
              detail: 'Profile updated successfully!' 
            });
            this.ref.close(true);
          }).catch((error) => {
            this.isUploading = false;
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Update Error', 
              detail: 'Failed to update email. Please try again.' 
            });
          });
        }).catch((error) => {
          this.isUploading = false;
          let errorMessage = 'Failed to update email. ';
          if (error.code === 'auth/requires-recent-login') {
            errorMessage += 'Please log out and log in again to change your email.';
          } else {
            errorMessage += error.message;
          }
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Email Update Error', 
            detail: errorMessage 
          });
        });
      } else {
        this.isUploading = false;
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Profile Updated', 
          detail: 'Profile updated successfully!' 
        });
        this.ref.close(true);
      }
    }).catch((error) => {
      this.isUploading = false;
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Update Error', 
        detail: 'Failed to update profile. Please try again.' 
      });
    });
  }

  cancel() {
    this.ref.close();
  }
}

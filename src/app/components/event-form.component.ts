import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from '../services/event.service'; 
import { AppEvent } from '../services/event.model';


@Component({
  standalone: true,
  selector: 'app-event-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  form: FormGroup;
  events: AppEvent[] = [];
  displayedColumns: string[] = ['title', 'type', 'start', 'end', 'actions'];
  isEditing = false;
  currentEventId: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      start: ['', Validators.required],
      end: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.isLoading = false; 
      },
      error: (err) => {
        this.showError('Error al cargar eventos');
        this.isLoading = false; 
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    
    this.isLoading = true; 
    const eventData = this.form.value;
    
    if (this.isEditing && this.currentEventId !== null) {
      this.eventService.updateEvent(this.currentEventId, eventData).subscribe({
        next: (updatedEvent) => {
          this.isLoading = false; 
        },
        error: (err) => {
          this.showError('Error al actualizar el evento');
          this.isLoading = false;
        }
      });
    } else {
      const newEvent: AppEvent = {
        title: eventData.title,
        start: this.formatToISO(eventData.start),
        end: this.formatToISO(eventData.end),
        type: Number(eventData.type),
        description: eventData.description
      };
      
      this.eventService.createEvent(newEvent).subscribe({
        next: (newEvent) => {
          this.loadEvents();
          this.isLoading = false;
        },
        error: (err) => {
          if (err.status == 200) this.loadEvents();
          else this.showError('Error al crear el evento');
          this.isLoading = false;
        }
      });
    }
  }

  onEdit(event: AppEvent): void {
    this.isEditing = true;
    this.currentEventId = event.id || null;
    this.form.patchValue({
      title: event.title,
      start: this.formatToISO(event.start),
      end:  this.formatToISO(event.end),
      type:  Number(event.type),
      description: event.description
    });
  }

  onDelete(id: string): void {
    if (confirm('¿Estás seguro?')) {
      this.isLoading = true;
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.loadEvents();
          this.isLoading = false;
        },
        error: (err) => {
          this.showError('Error al eliminar el evento');
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.form.reset();
    this.isEditing = false;
    this.currentEventId = null;
    this.isLoading = false;
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  get f() {
    return this.form.controls;
  }

  getFormTitle(): string {
    return this.isEditing ? 'Editar Evento' : 'Crear Nuevo Evento';
  }

  getSubmitButtonText(): string {
    return this.isEditing ? 'Actualizar' : 'Crear';
  }

  private formatToISO(dateStr: string): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error("Fecha inválida");
    }
    return date.toISOString(); 
  }
  
  
}
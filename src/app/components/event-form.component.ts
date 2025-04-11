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
    this.isLoading = true; // <-- Activar carga
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.isLoading = false; // <-- Desactivar carga
      },
      error: (err) => {
        this.showError('Error al cargar eventos');
        this.isLoading = false; // <-- Desactivar carga en caso de error
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    
    this.isLoading = true; // <-- Activar carga
    const eventData = this.form.value;
    
    if (this.isEditing && this.currentEventId !== null) {
      this.eventService.updateEvent(this.currentEventId, eventData).subscribe({
        next: (updatedEvent) => {
          // ... lógica de actualización
          this.isLoading = false; // <-- Desactivar carga
        },
        error: (err) => {
          this.showError('Error al actualizar el evento');
          this.isLoading = false;
        }
      });
    } else {
      this.eventService.createEvent(eventData).subscribe({
        next: (newEvent) => {
          // ... lógica de creación
          this.isLoading = false;
        },
        error: (err) => {
          this.showError('Error al crear el evento');
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
      start: event.start,
      end: event.end,
      type: event.type,
      description: event.description
    });
  }

  onDelete(id: string): void {
    if (confirm('¿Estás seguro?')) {
      this.isLoading = true;
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          // ... lógica de eliminación
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
}
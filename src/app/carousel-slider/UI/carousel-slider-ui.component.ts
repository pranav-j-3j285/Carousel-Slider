import { NgClass } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Observable, Subscription, interval, share } from 'rxjs';

@Component({
  selector: 'app-carousel-slider-ui',
  standalone: true,
  imports: [NgClass],
  templateUrl: './carousel-slider-ui.component.html',
  styleUrl: './carousel-slider-ui.component.scss'
})
export class CarouselSliderUiComponent implements OnInit, OnDestroy{
  // @Input({required: true, alias: "data"}) data$!: Observable<string[]>
  @Input({required: true}) slides: string[] = []
  @Input() previousBtn: boolean = true
  @Input() nextBtn: boolean = true
  @Input() containerHeight: string = '400px';
  @Input() containerWidth: string = '400px';
  @Input() slideIntervalTime: number = 3000;
  @Input() isInterval: boolean = true;
  @Input() stopOnHover: boolean = true; // Functionality Not Added Yet

  currentIndex: number = 0
  autoPlayTimer$!: Observable<number>
  autoPlayTimerSubs = new Subscription();

  constructor() {}

  ngOnInit(): void {
    this.autoPlayTimer$ = interval(this.slideIntervalTime).pipe(share());

    if(!this.isInterval) return
    this.startAutoPlayTimerFn();
  }

  startAutoPlayTimerFn(): void {
    this.autoPlayTimerSubs = this.autoPlayTimer$.pipe().subscribe(() => this.nextSlideFn());
  }

  restartAutoPlayTimerFn(): void {
    if(!this.isInterval) return
    if(this.autoPlayTimerSubs) {
      this.autoPlayTimerSubs.unsubscribe();
    }
    this.startAutoPlayTimerFn();
  }

  previousSlideFn(): void {
    if(this.currentIndex === 0) {
      this.currentIndex = this.slides.length - 1;
      return
    }
    this.currentIndex--;
    this.restartAutoPlayTimerFn();
  }
  
  nextSlideFn(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length; 
    this.restartAutoPlayTimerFn();
    // if(this.currentIndex === this.slides.length - 1) {      
    //   this.currentIndex = 0;
    //    return
    // }
    // this.currentIndex++;
  }

  bottomBarFn(index: number): void {
    this.currentIndex = index
    this.restartAutoPlayTimerFn();
  }

  ngOnDestroy(): void {
      this.autoPlayTimerSubs.unsubscribe();
  }

  //change by ronak
  private startX: number = 0;
  private endX: number = 0;

  // Touch events
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.endX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  // Mouse events
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.startX = event.clientX;
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.endX = event.clientX;
    this.handleSwipe();
  }

  private handleSwipe() {
    const threshold = 50; // Minimum distance to consider a swipe
    const swipeDistance = this.endX - this.startX;

    if (swipeDistance > threshold) {
      this.onSwipeRight();
    } else if (swipeDistance < -threshold) {
      this.onSwipeLeft();
    }
  }

  private onSwipeLeft() {
    this.nextSlideFn()
  }

  private onSwipeRight() {
    this.previousSlideFn()
  }
}

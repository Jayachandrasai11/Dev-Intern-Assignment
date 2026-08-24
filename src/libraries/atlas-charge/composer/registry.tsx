import type { ComponentConfig, Config } from '@puckeditor/core';
import React from 'react';
import * as C from '../components';
import { boolField, makeComposerConfig, makeLayoutComponents, makeSpaceOptions, opts } from '../../../composer/registryKit';
import { ATLAS_CHARGE_GLOBAL_TOKENS } from '../tokens/global';

const space = makeSpaceOptions(ATLAS_CHARGE_GLOBAL_TOKENS);
const select = (values: readonly string[], label?: string) => ({ type: 'select' as const, label, options: opts(values) });
const text = (label?: string) => ({ type: 'text' as const, label });

function block(Component: React.ComponentType<any>, fields: Record<string, any>, defaultProps: Record<string, any>, adapt?: (props: any) => any): ComponentConfig<any> {
  return { fields, defaultProps, render: (props: any) => React.createElement(Component, adapt ? adapt(props) : props) };
}

const raw: Record<string, ComponentConfig<any>> = {
  ...makeLayoutComponents(space),
  Button: block(C.Button, { label: text(), variant: select(['primary','secondary','tertiary','destructive']), width: select(['compact','full']), state: select(['default','pressed','loading','disabled']) }, { label:'Start charging', variant:'primary', width:'full', state:'default' }, ({label,...p}) => ({...p, children:label})),
  IconButton: block(C.IconButton, { icon:select(C.CHARGE_ICON_NAMES), label:text(), state:select(['default','pressed','selected','disabled','loading']) }, { icon:'star', label:'Favourite', state:'default' }),
  TextField: block(C.TextField, { label:text(), value:text(), placeholder:text(), message:text(), state:select(['empty','focused','filled','valid','error','disabled','read-only','verified']) }, { label:'Charger ID', value:'', placeholder:'Enter charger ID', message:'', state:'empty' }),
  OtpInput: block(C.OtpInput, { value:text(), state:select(['empty','partial','complete','checking','incorrect','expired','locked']) }, { value:'482', state:'partial' }),
  SelectionControl: block(C.SelectionControl, { type:select(['checkbox','radio']), label:text(), checked:boolField(), state:select(['default','focused','error','disabled']) }, { type:'checkbox', label:'I accept the privacy policy', checked:false, state:'default' }),
  Toggle: block(C.Toggle, { label:text(), checked:boolField(), state:select(['default','saving','failed','disabled']) }, { label:'Critical notifications', checked:true, state:'default' }),
  Chip: block(C.Chip, { label:text(), selected:boolField(), removable:boolField(), disabled:boolField() }, { label:'Available', selected:true, removable:false, disabled:false }, ({label,...p}) => ({...p, children:label})),
  StatusBadge: block(C.StatusBadge, { label:text(), tone:select(['neutral','info','success','warning','danger','unknown']) }, { label:'Available', tone:'success' }, ({label,...p}) => ({...p, children:label})),
  NamedProgress: block(C.NamedProgress, { label:text(), state:select(['in-progress','delayed','completed','failed','cancelled','unknown']) }, { label:'Checking charger', state:'in-progress' }),
  AppBar: block(C.AppBar, { title:text(), mode:select(['default','back','close','title-only','action']), scrolled:boolField() }, { title:'Charger details', mode:'back', scrolled:false }),
  SearchFilter: block(C.SearchFilter, { query:text(), state:select(['idle','focused','typing','results','no-results','error','offline']) }, { query:'', state:'idle' }),
  Alert: block(C.Alert, { title:text(), body:text(), action:text(), tone:select(['info','success','warning','danger']), dismissible:boolField() }, { title:'Status may be out of date', body:'Updated 18 minutes ago', action:'Refresh', tone:'warning', dismissible:false }),
  EmptyState: block(C.EmptyState, { title:text(), body:text(), action:text(), variant:select(['first-use','filtered','search','offline','failed']) }, { title:'Nothing here yet', body:'Your activity will appear here.', action:'Get started', variant:'first-use' }),
  OrientationCard: block(C.OrientationCard, { step:{ type:'number' }, state:select(['active','completed']) }, { step:1, state:'active' }),
  Coachmark: block(C.Coachmark, { text:text(), state:select(['first','next','dismissed','completed','target-unavailable']) }, { text:'Tap a charger to inspect availability.', state:'first' }),
  StatusPanel: block(C.StatusPanel, { kind:select(['permission','account','critical-notification','freshness','reconciliation','payment','ticket','request']), state:text(), title:text(), detail:text(), tone:select(['neutral','info','success','warning','danger','unknown']), action:text() }, { kind:'freshness', state:'Fresh', title:'Charger available', detail:'Last confirmed 2 minutes ago', tone:'success', action:'' }),
  SettingRow: block(C.SettingRow, { title:text(), detail:text(), mode:select(['chevron','toggle','status']), state:select(['default','granted','denied','blocked','saving','error']) }, { title:'Location access', detail:'Find nearby chargers', mode:'status', state:'granted' }),
  StationCard: block(C.StationCard, { state:select(['available','in-use','offline','maintenance','unknown']), stale:boolField(), loading:boolField() }, { state:'available', stale:false, loading:false }),
  MapMarker: block(C.MapMarker, { state:select(['available','unavailable','unknown']), selected:boolField(), clustered:boolField() }, { state:'available', selected:false, clustered:false }),
  RecordRow: block(C.RecordRow, { kind:select(['saved-location','notification','transaction','session','vehicle']), state:text(), title:text(), meta:text(), value:text() }, { kind:'session', state:'completed', title:'Indiranagar Hub', meta:'12 Aug · 42 min · completed', value:'₹248' }),
  LocationList: block(C.LocationList, { state:select(['expanded','collapsed','mixed','unavailable','stale','empty','failed']) }, { state:'expanded' }),
  DetailPanel: block(C.DetailPanel, { variant:select(['station-header','specification','connector','duration']), state:text() }, { variant:'specification', state:'complete' }),
  WalletCard: block(C.WalletCard, { variant:select(['readiness','balance']), state:select(['sufficient','low','zero','refreshing','shortfall','pending','unavailable']) }, { variant:'balance', state:'sufficient' }),
  CommandProgress: block(C.CommandProgress, { stage:{type:'number'}, state:select(['active','delayed','failed-retry','failed-support','cancelled','unknown']) }, { stage:2, state:'active' }),
  AmountSelector: block(C.AmountSelector, { state:select(['preset','custom','below-limit','above-limit','invalid','ready']) }, { state:'preset' }),
  PaymentMethodSelector: block(C.PaymentMethodSelector, { state:select(['available','selected','unavailable','loading','redirecting','verification']) }, { state:'selected' }),
  Accordion: block(C.Accordion, { title:text(), state:select(['collapsed','expanded','offline','no-results']) }, { title:'How do I start charging?', state:'expanded' }),
  SupportTile: block(C.SupportTile, { method:select(['chat','call','email']), state:select(['available','closed','launching','failed']) }, { method:'chat', state:'available' }),
  StepGuide: block(C.StepGuide, { current:{type:'number'}, completed:boolField() }, { current:1, completed:false }),
  BottomNav: block(C.BottomNav, { active:select(['home','wallet','sessions','profile']), state:select(['visible','badge','disabled','hidden']) }, { active:'home', state:'visible' }),
  ModalSheet: block(C.ModalSheet, { variant:select(['information','selection','confirmation','destructive']), state:select(['default','loading','error']) }, { variant:'confirmation', state:'default', manageFocus:false }),
  LaunchGate: block(C.LaunchGate, { state:select(['checking','offline','timeout','update-required','store-failure','resumable']) }, { state:'checking' }),
  ProfileForm: block(C.ProfileForm, { state:select(['view','edit','validating','saving','saved','field-error','save-failed','verified']) }, { state:'view' }),
  LegalViewer: block(C.LegalViewer, { state:select(['current','updated','cached','failed','update-available']) }, { state:'current' }),
  QrScanner: block(C.QrScanner, { state:select(['requesting','ready','checking','invalid','unreadable','denied','offline','timeout']) }, { state:'ready' }),
  ChargerDetail: block(C.ChargerDetail, { state:select(['loading','ready','unavailable','unknown','failed','price-changed','partial']) }, { state:'ready' }),
  StartReadiness: block(C.StartReadiness, { state:select(['ready','data-changed','unavailable','insufficient','stale','starting']) }, { state:'ready' }),
  ActiveSession: block(C.ActiveSession, { state:select(['starting','active','delayed','stale','interrupted','stopping','ending','unknown']) }, { state:'active' }),
  SessionSummary: block(C.SessionSummary, { state:select(['final','provisional','payment-pending','adjusted','invoice-unavailable','share-failed']) }, { state:'final' }),
  FilterSheet: block(C.FilterSheet, { state:select(['default','selected','applied','no-results','reset']) }, { state:'default', manageFocus:false }),
  TicketForm: block(C.TicketForm, { state:select(['draft','validating','submitting','delayed','submitted','failed']) }, { state:'draft' }),
  RequestChargerForm: block(C.RequestChargerForm, { state:select(['draft','location-denied','validation-error','saving','ready','submitting','submitted','delayed','duplicate','failed']) }, { state:'draft' }),
};

const atoms = ['Button','IconButton','TextField','OtpInput','SelectionControl','Toggle','Chip','StatusBadge','NamedProgress'];
const organisms = ['BottomNav','ModalSheet','LaunchGate','ProfileForm','LegalViewer','QrScanner','ChargerDetail','StartReadiness','ActiveSession','SessionSummary','FilterSheet','TicketForm','RequestChargerForm'];
const layout = ['Group','Stack','Row','Spacer'];
const molecules = Object.keys(raw).filter((name) => !layout.includes(name) && !atoms.includes(name) && !organisms.includes(name));
const categories: Config['categories'] = {
  layout: { title:'Layout', components:layout },
  atoms: { title:'Atoms', components:atoms },
  molecules: { title:'Molecules', components:molecules },
  organisms: { title:'Organisms', components:organisms },
};

export const composerConfig = makeComposerConfig({ categories, components:raw, space });

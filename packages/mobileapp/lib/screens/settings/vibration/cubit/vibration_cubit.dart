import 'package:flutter_vibrate/flutter_vibrate.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'package:json_annotation/json_annotation.dart';

extension VibrationStatusX on VibrationStatus {
  bool get isEnabled => this == VibrationStatus.enabled;
  bool get isInitial => this == VibrationStatus.initial;
  bool get isDisabled => this == VibrationStatus.disabled;
}

enum VibrationStatus { initial, enabled, disabled }

class VibrationCubit extends HydratedCubit<VibrationStatus> {
  VibrationCubit() : super(VibrationStatus.initial);

  void enable() => emit(VibrationStatus.enabled);

  void disable() => emit(VibrationStatus.disabled);

  void newNoun() async {
    if (state.isEnabled && await Vibrate.canVibrate) {
      Vibrate.feedback(FeedbackType.medium);
    }
  }

  @override
  VibrationStatus fromJson(Map<String, dynamic> json) =>
      $enumDecodeNullable(_$VibrationStatusEnumMap, json['status']) ??
      VibrationStatus.initial;

  @override
  Map<String, dynamic> toJson(VibrationStatus state) =>
      {'status': _$VibrationStatusEnumMap[state]};
}

const _$VibrationStatusEnumMap = {
  VibrationStatus.initial: 'initial',
  VibrationStatus.enabled: 'enabled',
  VibrationStatus.disabled: 'disabled',
};
